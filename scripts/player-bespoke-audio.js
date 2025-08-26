/**
 * Player Bespoke Audio Module
 * Allows GMs to upload and play audio files specifically for individual players
 */

class PlayerBespokeAudio {
  static ID = "player-bespoke-audio";
  static SOCKET = `module.${PlayerBespokeAudio.ID}`;

  static FLAGS = {
    AUDIO_FILES: "audioFiles",
  };

  static TEMPLATES = {
    AUDIO_TAB: `modules/${PlayerBespokeAudio.ID}/templates/audio-tab.hbs`,
    GM_CONTROLS: `modules/${PlayerBespokeAudio.ID}/templates/gm-controls.hbs`,
  };

  static initialize() {
    console.log(
      `${PlayerBespokeAudio.ID} | Initializing Player Bespoke Audio module`
    );

    // Register settings
    PlayerBespokeAudio.registerSettings();

    // Register socket listeners
    PlayerBespokeAudio.registerSocketListeners();

    // Hook into character sheet rendering
    PlayerBespokeAudio.registerHooks();

    console.log(`${PlayerBespokeAudio.ID} | Module initialized`);
  }

  static registerSettings() {
    // Register module settings
    game.settings.register(PlayerBespokeAudio.ID, "enableGMControls", {
      name: "Enable GM Controls",
      hint: "Show GM controls for playing audio to specific players",
      scope: "world",
      config: true,
      type: Boolean,
      default: true,
    });

    game.settings.register(PlayerBespokeAudio.ID, "audioVolume", {
      name: "Default Audio Volume",
      hint: "Default volume level for played audio files (0-1)",
      scope: "client",
      config: true,
      type: Number,
      default: 0.5,
      range: {
        min: 0,
        max: 1,
        step: 0.1,
      },
    });
  }

  static registerSocketListeners() {
    game.socket.on(PlayerBespokeAudio.SOCKET, (data) => {
      console.log(`${PlayerBespokeAudio.ID} | Received socket data:`, data);

      switch (data.action) {
        case "playAudio":
          PlayerBespokeAudio.handlePlayAudio(data);
          break;
        case "stopAudio":
          PlayerBespokeAudio.handleStopAudio(data);
          break;
        default:
          console.warn(
            `${PlayerBespokeAudio.ID} | Unknown socket action: ${data.action}`
          );
      }
    });
  }

  static registerHooks() {
    // Hook into character sheet rendering to add audio tab
    Hooks.on("renderActorSheet", PlayerBespokeAudio.onRenderActorSheet);

    // Hook into ready to initialize GM controls
    Hooks.once("ready", PlayerBespokeAudio.onReady);
  }

  static onReady() {
    console.log(`${PlayerBespokeAudio.ID} | Ready hook triggered`);

    // Initialize GM controls if user is GM
    if (
      game.user.isGM &&
      game.settings.get(PlayerBespokeAudio.ID, "enableGMControls")
    ) {
      PlayerBespokeAudio.initializeGMControls();
    }
  }

  static async onRenderActorSheet(sheet, html, data) {
    // Only add audio tab for character actors
    if (sheet.actor.type !== "character") return;

    // Only show to GM or the player who owns the character
    if (!game.user.isGM && !sheet.actor.isOwner) return;

    console.log(
      `${PlayerBespokeAudio.ID} | Adding audio tab to character sheet for ${sheet.actor.name}`
    );

    try {
      // Add the audio tab
      await PlayerBespokeAudio.addAudioTab(sheet, html, data);
    } catch (error) {
      console.error(
        `${PlayerBespokeAudio.ID} | Error adding audio tab:`,
        error
      );
    }
  }

  static async addAudioTab(sheet, html, data) {
    // Find the tabs navigation
    const tabs = html.find('.tabs[data-group="primary"]');
    if (tabs.length === 0) {
      console.warn(`${PlayerBespokeAudio.ID} | Could not find tabs navigation`);
      return;
    }

    // Add audio tab to navigation
    const audioTab = $(`<a class="item" data-tab="audio">
            <i class="fas fa-music"></i> ${game.i18n.localize("PBA.AudioTab")}
        </a>`);
    tabs.append(audioTab);

    // Find the tab content area
    const tabContent = html.find('.tab[data-tab="details"]').parent();

    // Get audio files for this actor
    const audioFiles =
      sheet.actor.getFlag(
        PlayerBespokeAudio.ID,
        PlayerBespokeAudio.FLAGS.AUDIO_FILES
      ) || [];

    // Render the audio tab content
    const audioTabContent = await renderTemplate(
      PlayerBespokeAudio.TEMPLATES.AUDIO_TAB,
      {
        audioFiles: audioFiles,
        isGM: game.user.isGM,
        actorId: sheet.actor.id,
      }
    );

    // Add the audio tab content
    tabContent.append(
      `<div class="tab audio" data-tab="audio">${audioTabContent}</div>`
    );

    // Bind event listeners
    PlayerBespokeAudio.bindAudioTabEvents(html, sheet.actor);
  }

  static bindAudioTabEvents(html, actor) {
    // File upload handler
    html.find(".audio-file-upload").on("change", async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      try {
        await PlayerBespokeAudio.uploadAudioFile(actor, file);
        // Refresh the sheet to show the new file
        actor.sheet.render();
      } catch (error) {
        ui.notifications.error(`Failed to upload audio file: ${error.message}`);
      }
    });

    // Delete audio file handler
    html.find(".delete-audio-file").on("click", async (event) => {
      const fileName = $(event.currentTarget).data("file-name");
      const confirmed = await Dialog.confirm({
        title: game.i18n.localize("PBA.DeleteAudioFile"),
        content: `<p>${game.i18n.localize(
          "PBA.DeleteAudioFileConfirm"
        )}: <strong>${fileName}</strong></p>`,
      });

      if (confirmed) {
        try {
          await PlayerBespokeAudio.deleteAudioFile(actor, fileName);
          actor.sheet.render();
        } catch (error) {
          ui.notifications.error(
            `Failed to delete audio file: ${error.message}`
          );
        }
      }
    });

    // Play audio file handler (GM only)
    if (game.user.isGM) {
      html.find(".play-audio-file").on("click", (event) => {
        const fileName = $(event.currentTarget).data("file-name");
        const filePath = $(event.currentTarget).data("file-path");
        PlayerBespokeAudio.playAudioForPlayer(actor, fileName, filePath);
      });
    }
  }

  static async uploadAudioFile(actor, file) {
    // Validate file type
    if (!file.type.startsWith("audio/")) {
      throw new Error("Only audio files are allowed");
    }

    // Create upload path
    const uploadPath = `modules/${PlayerBespokeAudio.ID}/audio/${actor.id}/`;

    try {
      // Show user that we're preparing the upload
      ui.notifications.info(`Preparing to upload "${file.name}"...`);

      // Try to upload the file directly - Foundry will create directories automatically
      let response;
      try {
        response = await FilePicker.upload("data", uploadPath, file);
        console.log(
          `${PlayerBespokeAudio.ID} | Upload successful to: ${response.path}`
        );
      } catch (uploadError) {
        console.warn(
          `${PlayerBespokeAudio.ID} | Upload failed, trying fallback path:`,
          uploadError
        );

        // Fallback: try to upload to a simpler path
        const fallbackPath = `modules/${PlayerBespokeAudio.ID}/audio/`;
        ui.notifications.info(`Trying fallback upload location...`);
        response = await FilePicker.upload("data", fallbackPath, file);

        if (response.path) {
          console.log(
            `${PlayerBespokeAudio.ID} | Upload successful to fallback path: ${response.path}`
          );
        }
      }

      if (!response.path) {
        throw new Error("Failed to upload file");
      }

      // Get current audio files
      const audioFiles =
        actor.getFlag(
          PlayerBespokeAudio.ID,
          PlayerBespokeAudio.FLAGS.AUDIO_FILES
        ) || [];

      // Add new file to the list
      const newFile = {
        name: file.name,
        path: response.path,
        uploadedAt: new Date().toISOString(),
        uploadedBy: game.user.name,
      };

      audioFiles.push(newFile);

      // Update the flag
      await actor.setFlag(
        PlayerBespokeAudio.ID,
        PlayerBespokeAudio.FLAGS.AUDIO_FILES,
        audioFiles
      );

      ui.notifications.info(`Audio file "${file.name}" uploaded successfully`);
      console.log(`${PlayerBespokeAudio.ID} | Uploaded audio file:`, newFile);
    } catch (error) {
      console.error(
        `${PlayerBespokeAudio.ID} | Error uploading audio file:`,
        error
      );
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  static async deleteAudioFile(actor, fileName) {
    // Get current audio files
    const audioFiles =
      actor.getFlag(
        PlayerBespokeAudio.ID,
        PlayerBespokeAudio.FLAGS.AUDIO_FILES
      ) || [];

    // Find the file to delete
    const fileIndex = audioFiles.findIndex((f) => f.name === fileName);
    if (fileIndex === -1) {
      throw new Error("Audio file not found");
    }

    const fileToDelete = audioFiles[fileIndex];

    // Remove from array
    audioFiles.splice(fileIndex, 1);

    // Update the flag
    await actor.setFlag(
      PlayerBespokeAudio.ID,
      PlayerBespokeAudio.FLAGS.AUDIO_FILES,
      audioFiles
    );

    // Attempt to delete the physical file
    try {
      // Note: Foundry doesn't provide a direct API to delete files
      // This would need to be handled server-side or manually
      console.log(
        `${PlayerBespokeAudio.ID} | File removed from actor: ${fileToDelete.path}`
      );
    } catch (error) {
      console.warn(
        `${PlayerBespokeAudio.ID} | Could not delete physical file:`,
        error
      );
    }

    ui.notifications.info(`Audio file "${fileName}" removed from playlist`);
  }

  static playAudioForPlayer(actor, fileName, filePath) {
    // Find the player who owns this character
    const playerUser = game.users.find(
      (user) =>
        user.character?.id === actor.id ||
        actor.permission[user.id] === CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER
    );

    if (!playerUser) {
      ui.notifications.warn(`No player found for character ${actor.name}`);
      return;
    }

    // Send socket message to play audio
    const socketData = {
      action: "playAudio",
      targetUserId: playerUser.id,
      fileName: fileName,
      filePath: filePath,
      actorName: actor.name,
      volume: game.settings.get(PlayerBespokeAudio.ID, "audioVolume"),
    };

    game.socket.emit(PlayerBespokeAudio.SOCKET, socketData);

    ui.notifications.info(
      `Playing "${fileName}" for ${playerUser.name} (${actor.name})`
    );
    console.log(
      `${PlayerBespokeAudio.ID} | Sent play audio command:`,
      socketData
    );
  }

  static handlePlayAudio(data) {
    // Only play if this is the target user
    if (data.targetUserId !== game.user.id) return;

    console.log(
      `${PlayerBespokeAudio.ID} | Playing audio for current user:`,
      data
    );

    try {
      // Create audio element
      const audio = new Audio(data.filePath);
      audio.volume = data.volume || 0.5;

      // Play the audio
      audio
        .play()
        .then(() => {
          ui.notifications.info(
            `Playing audio: ${data.fileName} (from ${data.actorName})`
          );
        })
        .catch((error) => {
          console.error(
            `${PlayerBespokeAudio.ID} | Error playing audio:`,
            error
          );
          ui.notifications.error(`Failed to play audio: ${error.message}`);
        });

      // Store reference for potential stopping
      PlayerBespokeAudio.currentAudio = audio;
    } catch (error) {
      console.error(
        `${PlayerBespokeAudio.ID} | Error handling play audio:`,
        error
      );
    }
  }

  static handleStopAudio(data) {
    // Only stop if this is the target user
    if (data.targetUserId !== game.user.id) return;

    if (PlayerBespokeAudio.currentAudio) {
      PlayerBespokeAudio.currentAudio.pause();
      PlayerBespokeAudio.currentAudio = null;
      ui.notifications.info("Audio stopped by GM");
    }
  }

  static initializeGMControls() {
    // This could add a button to the UI or create a dialog for GM controls
    console.log(`${PlayerBespokeAudio.ID} | GM controls initialized`);
  }
}

// Initialize the module when Foundry is ready
Hooks.once("init", () => {
  PlayerBespokeAudio.initialize();
});

// Export for global access
window.PlayerBespokeAudio = PlayerBespokeAudio;

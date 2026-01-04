import React from 'react';
import {LiveObjects} from "../api/abletonLive";

test('renders learn react link', () => {
  const response = {
    "": {
      "___type": "root",
      "live_set": {
        "___type": "Song",
        "groove_pool": {
          "___type": "GroovePool",
          "grooves": {
            "___type": "collection"
          }
        },
        "master_track": {
          "___type": "Track",
          "mixer_device": {
            "___type": "MixerDevice"
          },
          "view": {
            "___type": "View"
          },
          "clip_slots": {
            "___type": "Vector"
          },
          "devices": {
            "___type": "Vector"
          }
        },
      },
      "live_app": {
        "___type": "Application",
        "view": {
          "___type": "View"
        }
      },
      "control_surfaces": {
        "___type": "list"
      },
      "this_device": {
        "___type": "MaxDevice",
        "view": {
          "___type": "View"
        },
        "parameters": {
          "0": {
            "___type": "DeviceParameter"
          },
          "___type": "Vector"
        }
      }
    }
  };

  const liveObjects = new LiveObjects().process(response);
  expect(liveObjects.root.get("live_set")).not.toBeNull();
  expect(liveObjects.root.get("live_set")?.get("groove_pool")?.get("grooves")).not.toBeNull();
  expect(liveObjects.root.get("live_set")?.get("master_track")).not.toBeNull();
  expect(liveObjects.root.get("live_set")?.get("master_track")?.get("mixer_device")).not.toBeNull();
  expect(liveObjects.root.get("live_set")?.get("master_track")?.get("view")).not.toBeNull();
  expect(liveObjects.root.get("live_set")?.get("master_track")?.get("clip_slots")).not.toBeNull();
  expect(liveObjects.root.get("live_set")?.get("master_track")?.get("devices")).not.toBeNull();
  expect(liveObjects.root.get("live_app")).not.toBeNull();
  expect(liveObjects.root.get("live_app")?.get("view")).not.toBeNull();
  expect(liveObjects.root.get("control_surfaces")).not.toBeNull();
  expect(liveObjects.root.get("this_device")).not.toBeNull();
  expect(liveObjects.root.get("this_device")?.get("view")).not.toBeNull();
  expect(liveObjects.root.get("this_device")?.get("parameters")).not.toBeNull();
  expect(liveObjects.root.get("this_device")?.get("parameters")?.get("0")).not.toBeNull();
});

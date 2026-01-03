import liveApiGetInfo from "../liveApiGetInfo.js"
import expect from "expect"

describe('liveApiGetInfo', () => {
  it('should return structured info', () => {

    var infoString = "id 13\ntype Track\ndescription This class represents a track in Live. It can be either an Audio  track\n," +
      " a MIDI Track\n, a Return Track or the Master track. The Master  Track and at least one Audio or MIDI track will be always " +
      "present. Return Tracks are optional.\n" +
      "children arrangement_clips Clip\n" +
      "children clip_slots ClipSlot\n" +
      "children devices Device\n" +
      "child canonical_parent Song\n" +
      "child group_track Track\n" +
      "child mixer_device MixerDevice\n" +
      "child view View\n" +
      "property arm bool\n" +
      "property available_input_routing_channels dict\n" +
      "property can_be_armed bool\n" +
      "property color int\n" +
      "property current_input_routing str\n" +
      "property output_routings StringVector\n" +
      "function create_audio_clip\n" +
      "function delete_clip\n" +
      "function duplicate_clip_to_arrangement\n" +
      "function jump_in_running_session_clip\n" +
      "function stop_all_clips\n" +
      "done\n";

    function liveApiMock(path) {
      return {info: infoString};
    }
    var getInfo = liveApiGetInfo(liveApiMock);
    var info = getInfo("live_set tracks 0");

    expect(info).not.toBeNull()
    expect(info.id).toBe("13");
    expect(info.type).toBe("Track");
    expect(info.description).toBe("This class represents a track in Live. It can be either an Audio  track\n, a MIDI Track\n, a Return Track or the Master track. The Master  Track and at least one Audio or MIDI track will be always present. Return Tracks are optional.");
    expect(info.type).toBe("Track");
    expect(info.collections.length).toBe(3);
    expect(info.collections[0]).toStrictEqual({name: "arrangement_clips", type: "Clip"});
    expect(info.collections[1]).toStrictEqual({name: "clip_slots", type: "ClipSlot"});
    expect(info.collections[2]).toStrictEqual({name: "devices", type: "Device"});
    expect(info.children.length).toBe(4);
    expect(info.children[0]).toStrictEqual({name: "canonical_parent", type: "Song"});
    expect(info.children[1]).toStrictEqual({name: "group_track", type: "Track"});
    expect(info.children[2]).toStrictEqual({name: "mixer_device", type: "MixerDevice"});
    expect(info.children[3]).toStrictEqual({name: "view", type: "View"});
    expect(info.properties.length).toBe(6);
    expect(info.properties[0]).toStrictEqual({name: "arm", type: "bool"});
    expect(info.properties[1]).toStrictEqual({name: "available_input_routing_channels", type: "dict"});
    expect(info.properties[2]).toStrictEqual({name: "can_be_armed", type: "bool"});
    expect(info.properties[3]).toStrictEqual({name: "color", type: "int"});
    expect(info.properties[4]).toStrictEqual({name: "current_input_routing", type: "str"});
    expect(info.properties[5]).toStrictEqual({name: "output_routings", type: "StringVector"});
    expect(info.functions.length).toBe(5);
    expect(info.functions[0]).toStrictEqual("create_audio_clip");
    expect(info.functions[1]).toStrictEqual("delete_clip");
    expect(info.functions[2]).toStrictEqual("duplicate_clip_to_arrangement");
    expect(info.functions[3]).toStrictEqual("jump_in_running_session_clip");
    expect(info.functions[4]).toStrictEqual("stop_all_clips");
    expect(info.others.length).toBe(0);
  });
});
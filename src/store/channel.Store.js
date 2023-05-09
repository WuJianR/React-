import { makeAutoObservable } from "mobx";
import { http } from "@/utils";

class ChannelsStore {
  channelsList = [];
  constructor() {
    makeAutoObservable(this);
  }
  getChannels = async () => {
    const res = await http.get("/channels");
    this.channelsList = res.data.channels;
  };
}

export default ChannelsStore;

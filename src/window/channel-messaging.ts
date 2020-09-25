const channel = new MessageChannel();

type ChannelMessagingOptions = {
  url: string;
  callback: Function;
  host: string;
};

// Provide safe cross domain messaging
// Use the MessageChannel approach, as IE has problems with standard messaging
export const init = (
  iframe: HTMLIFrameElement,
  options: ChannelMessagingOptions
) => {
  const { url, callback, host } = options;

  // Process a message received
  const messageReceiver = (e: MessageEvent) => {
    if (e.isTrusted) {
      callback(e.data);
    }
  };

  // Share a message
  const messageSender = (target: Window, data: any) => {
    channel.port1.postMessage(data);
  };

  const removeListener = () => {
    channel.port1.onmessage = null;
  };

  const onLoad = () => {
    // Add a messaging receiver
    channel.port1.onmessage = messageReceiver;

    // Supply the channel port
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage("init", "*", [channel.port2]);
    }
  };

  // Wait for the initialisation
  iframe.addEventListener("load", onLoad);

  // Return the unsubscribe action
  return {
    url,
    host,
    remove: removeListener,
    dispatch: messageSender,
  };
};

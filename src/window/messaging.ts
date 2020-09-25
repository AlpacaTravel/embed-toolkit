type MessagingOptions = {
  url: string;
  callback: Function;
  host: string;
};

// Provide safe cross domain messaging
export const init = (iframe: HTMLIFrameElement, options: MessagingOptions) => {
  const { url, callback, host } = options;

  // Process a message received
  const messageReceiver = (e: MessageEvent) => {
    if (e.isTrusted) {
      callback(e.data);
    }
  };

  // Share a message
  const messageSender = (target: Window, data: any) => {
    // console.log('Sending', host, data);
    target.postMessage(data, host);
  };

  // Subscribe to the window events
  window.addEventListener("message", messageReceiver, false);
  const removeListener = () => {
    window.removeEventListener("message", messageReceiver, false);
  };

  // Return the unsubscribe action
  return {
    url,
    host,
    remove: removeListener,
    dispatch: messageSender,
  };
};

const channel = new MessageChannel();

// Provide safe cross domain messaging
// Use the MessageChannel approach, as IE has problems with standard messaging
const init = (iframe, options = {}) => {
  const { url, callback, host } = options;

  // Process a message received
  const messageReceiver = (e) => {
    if (e.isTrusted) {
      callback(e.data);
    }
  };

  // Share a message
  const messageSender = (target, data) => {
    channel.port1.postMessage(data);
  };

  const removeListener = () => {
    channel.port1.onmessage = null;
  };

  const onLoad = () => {
    // Add a messaging receiver
    channel.port1.onmessage = messageReceiver;

    // Supply the channel port
    iframe.contentWindow.postMessage("init", "*", [channel.port2]);
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

module.exports = { init };

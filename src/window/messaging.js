// Provide safe cross domain messaging
const init = (iframe, options = {}) => {
  const { url, callback, host } = options;

  // Process a message received
  const messageReceiver = (e) => {
    // console.log('Received', e, e.isTrusted);
    if (e.isTrusted) {
      callback(e.data);
    }
  };

  // Share a message
  const messageSender = (target, data) => {
    // console.log('Sending', host, data);
    target.postMessage(data, host);
  };

  // Subscribe to the window events
  const listener = window.addEventListener("message", messageReceiver, false);
  const removeListener = () => {
    window.removeEventListener("message", listener, false);
  };

  // Return the unsubscribe action
  return {
    url,
    host,
    remove: removeListener,
    dispatch: messageSender,
  };
};

module.exports = { init };

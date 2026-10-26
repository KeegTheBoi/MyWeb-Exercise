async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  let data;

  try {
    data = await response.json();
  } catch (error) {
    const message = response.ok
      ? "The server returned an invalid JSON response."
      : `Request failed with status ${response.status}.`;
    const requestError = new Error(message, { cause: error });
    requestError.status = response.status;
    throw requestError;
  }

  if (!response.ok || !data || data.success !== true) {
    const requestError = new Error(
      data?.message || `Request failed with status ${response.status}.`,
    );
    requestError.status = response.status;
    requestError.data = data;
    throw requestError;
  }

  return data;
}

window.requestJson = requestJson;

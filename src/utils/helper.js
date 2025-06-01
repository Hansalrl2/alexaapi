const isUrl = (url) => {
  const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi;
  return urlPattern.test(url);
}

const checkUrl = (res, url, query) => {
  if (!isUrl(url)) return false
  // Check if the URL contains the query
  if (url.includes(query)) {
    return url; // Return the valid URL
  } else {
    return false
  }
}

const handleError = (res, error) => {
  let statusCode = 500;
  let errorMessage = "An error occurred on the server.";

  if (error.name === 'FetchError') {
    statusCode = 502;
    errorMessage = "Failed to connect to the service.";
  } else if (error.code === 'ECONNREFUSED') {
    statusCode = 503;
    errorMessage = "Service unavailable.";
  }

  res.status(statusCode).json({ status: false, error: errorMessage });
};

const checkStatus = (res, response) => {
  if (!response.status) return res.status(500).json({ status: false, error: response.message });
  else res.status(200).json(response);
}

export {
  handleError,
  checkStatus,
  isUrl,
  checkUrl
}
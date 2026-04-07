export const getPrompts = async ({ aiUrl, token, filters }) => {
  const requestUrl = `${aiUrl}/prompts/filter`;
  let filtersParams = {};
  if (filters.event) {
    filtersParams.event = true;
  }
  if (filters.blog) {
    filtersParams.blog = true;
  }
  if (filters.newsletter) {
    filtersParams.newsletter = true;
  }
  const params = new URLSearchParams(filtersParams);

  const options = {
    method: "GET",
    // mode: "no-cors",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(`${requestUrl}?${params}`, options);

  if (!response.ok) {
    throw new Error(
      `HTTP GET error, status: ${response.status}, url: ${requestUrl}`,
    );
  }

  try {
    const jsonData = await response.json();
    return jsonData;
  } catch (e) {
    throw new Error(
      `HTTP GET error, status: ${response.status}, url: ${requestUrl}`,
    );
  }
};

export const genetateArticle = async ({ aiUrl, token, content, promptId }) => {
  const requestUrl = `${aiUrl}/prompts/${promptId}/answer`;

  const options = {
    method: "POST",
    // mode: "no-cors",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      workload: content,
    }),
  };

  const response = await fetch(requestUrl, options);

  if (!response.ok) {
    throw new Error(
      `HTTP GET error, status: ${response.status}, url: ${requestUrl}`,
    );
  }

  try {
    const jsonData = await response.json();
    return jsonData;
  } catch (e) {
    throw new Error(
      `HTTP GET error, status: ${response.status}, url: ${requestUrl}`,
    );
  }
};

export const parseLinkContent = async ({ aiUrl, token, url }) => {
  const requestUrl = `${aiUrl}/scraper/scrape`;

  const options = {
    method: "POST",
    // mode: "no-cors",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
    }),
  };

  const response = await fetch(requestUrl, options);

  if (!response.ok) {
    throw new Error(
      `HTTP GET error, status: ${response.status}, url: ${requestUrl}`,
    );
  }

  try {
    const jsonData = await response.json();
    return jsonData;
  } catch (e) {
    throw new Error(
      `HTTP GET error, status: ${response.status}, url: ${requestUrl}`,
    );
  }
};

export const genetateSingleArticle = async ({
  aiUrl,
  token,
  sources,
  language,
}) => {
  const requestUrl = `${aiUrl}/cockpit/generate-article`;

  const options = {
    method: "POST",
    // mode: "no-cors",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sources,
      target_language: language,
    }),
  };

  const response = await fetch(requestUrl, options);

  // if (!response.ok) {
  //   console.log("=====", response.json());
  //   throw new Error(
  //     `HTTP GET error, status: ${response.status}, url: ${requestUrl}`,
  //   );
  // }

  try {
    const jsonData = await response.json();
    return jsonData;
  } catch (e) {
    throw new Error(
      `HTTP GET error, status: ${response.status}, url: ${requestUrl}`,
    );
  }
};

export const genetateEditArticle = async ({
  aiUrl,
  token,
  content,
  prompt,
  language,
}) => {
  const requestUrl = `${aiUrl}/cockpit/edit-article`;

  const options = {
    method: "POST",
    // mode: "no-cors",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
      prompt,
      language,
    }),
  };

  const response = await fetch(requestUrl, options);

  if (!response.ok) {
    throw new Error(
      `HTTP GET error, status: ${response.status}, url: ${requestUrl}`,
    );
  }

  try {
    const jsonData = await response.json();
    return jsonData;
  } catch (e) {
    throw new Error(
      `HTTP GET error, status: ${response.status}, url: ${requestUrl}`,
    );
  }
};

export const genetateImage = async ({ aiUrl, token, content, language }) => {
  const requestUrl = `${aiUrl}/cockpit/generate-image`;

  const options = {
    method: "POST",
    // mode: "no-cors",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
      language,
    }),
  };

  const response = await fetch(requestUrl, options);

  if (!response.ok) {
    throw new Error(
      `HTTP GET error, status: ${response.status}, url: ${requestUrl}`,
    );
  }

  try {
    const jsonData = await response.json();
    return jsonData;
  } catch (e) {
    throw new Error(
      `HTTP GET error, status: ${response.status}, url: ${requestUrl}`,
    );
  }
};

export const genetateTitle = async ({ aiUrl, token, content, language }) => {
  const requestUrl = `${aiUrl}/cockpit/generate-title`;

  const options = {
    method: "POST",
    // mode: "no-cors",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
      language,
    }),
  };

  const response = await fetch(requestUrl, options);

  if (!response.ok) {
    throw new Error(
      `HTTP GET error, status: ${response.status}, url: ${requestUrl}`,
    );
  }

  try {
    const jsonData = await response.json();
    return jsonData;
  } catch (e) {
    throw new Error(
      `HTTP GET error, status: ${response.status}, url: ${requestUrl}`,
    );
  }
};

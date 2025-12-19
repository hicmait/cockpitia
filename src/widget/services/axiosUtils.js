import axios from "axios";

import { isServer } from "./utils";

export function generateCancellationTokenSource() {
  let cancellationToken = axios.CancelToken;
  return cancellationToken.source();
}

export function getRequestCancellationToken(
  cancellationTokenSource,
  newCancellationTokenSource
) {
  if (cancellationTokenSource) {
    cancellationTokenSource.cancel("Request canceled!");
  }
  cancellationTokenSource = newCancellationTokenSource;
  if (cancellationTokenSource) {
    return cancellationTokenSource.token;
  }
  return null;
}

export function getRequestConfig(params, requestCancellationToken) {
  let requestConfig = {};

  if (params) {
    requestConfig.params = params;
  }

  if (requestCancellationToken) {
    requestConfig.cancelToken = requestCancellationToken;
  }

  requestConfig.headers = { Accept: "application/json,app=COCKPIT" };

  return requestConfig;
}

export function throwCatchedError(thrown) {
  if (axios.isCancel(thrown)) {
    throw { response: { status: 700 } };
  } else {
    throw thrown;
  }
}

export function createCancellationTokenSource(task, dispatch) {
  if (isServer) {
    return null;
  }
  let cancellationTokenSource = generateCancellationTokenSource();
  return cancellationTokenSource;
}

export function updateSourceToken(oldSourceToken, newSourceToken) {
  if (oldSourceToken) {
    oldSourceToken.cancel("Operation canceled by the user.");
  }
  return newSourceToken;
}

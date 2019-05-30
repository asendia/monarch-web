import axios from 'axios';

export const generateHeaders = async function generateHeaders(netlifyIdentity) {
  const headers = { 'Content-Type': 'application/json' };
  if (netlifyIdentity && netlifyIdentity.currentUser()) {
    const token = await netlifyIdentity.currentUser().jwt();
    return { ...headers, Authorization: `Bearer ${token}` };
  }
  return headers;
}

export const protractTestament = async function protractTestament(id, token) {
  const res = await axios.post(
    `https://x46g8u90qd.execute-api.ap-southeast-1.amazonaws.com/default/protract`,
    { id, token },
    { 'Content-Type': 'application/json' }
  );
  return res;
}

export const unsubscribeTestament = async function unsubscribeTestament(id, token, email) {
  const res = await axios.post(
    `https://x46g8u90qd.execute-api.ap-southeast-1.amazonaws.com/default/unsubscribe`,
    { id, token, email },
    { 'Content-Type': 'application/json' }
  );
  return res;
}

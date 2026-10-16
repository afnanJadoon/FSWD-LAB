async function fetchUser(userId) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);

    if (!response.ok) {
      throw new Error("User not found");
    }

    const user = await response.json();
    return user;

  } catch (error) {
    throw new Error(error.message);
  }
}

async function fetchAndValidate(userId, postId) {
  try {
    const promise1 = fetchUser(userId);
    const promise2 = fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`).then(res => res.json());

    const [user, post] = await Promise.all([promise1, promise2]);

    const isUserValid = user && user.id;
    const isPostValid = post && post.id;

    if (isUserValid && isPostValid) {
      return { user, post }; 
    } else {
      throw new Error("Validation failed: Data is incomplete"); 
    }

  } catch (error) {
    throw new Error(error.message);
  }
}

fetchAndValidate(1, 1)
  .then(data => console.log("SUCCESS:", data))
  .catch(err => console.log("ERROR:", err.message));

fetchAndValidate(99999, 1)
  .then(data => console.log("SUCCESS:", data))
  .catch(err => console.log("ERROR:", err.message));
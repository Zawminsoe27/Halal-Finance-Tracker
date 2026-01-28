const url = "https://jsonplaceholder.typicode.com/posts";

async function fetchPost() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    data.forEach((post) => {
      console.log(post.id, post.title);
    });
  } catch (error) {
    console.log(error);
  }
}

fetchPost();

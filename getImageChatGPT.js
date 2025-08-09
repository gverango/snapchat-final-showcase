import { API_KEY } from "@env";

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Bearer " + API_KEY);

export const getImageChat = async ({ prompt, imageUrl }) => {
  const messages = [
    {
      role: "user",
      content: [
        { type: "text", text: prompt },
        {
          type: "image_url",
          image_url: {
            url: imageUrl.trim(), // remove any accidental whitespace
          },
        },
      ],
    },
  ];

  const raw = JSON.stringify({
    model: "gpt-4o",
    messages: messages,
    temperature: 1,
    top_p: 1,
    n: 1,
    stream: false,
    max_tokens: 600,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    requestOptions
  );

  return await response.json();
};

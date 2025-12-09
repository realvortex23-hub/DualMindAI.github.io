import openai

client = openai.OpenAI(
    api_key = "AIzaSyCncNkY79DZI_5gRtBHBgMrBWk3eM3lwzY",  # or os.getenv("POE_API_KEY")
    base_url = "https://api.poe.com/v1",
)

chat = client.chat.completions.create(
    model = "gemini-3-pro",
    messages = [{"role": "user", "content": "Hello world"}]
)

print(chat.choices[0].message.content)

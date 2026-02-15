from openai import OpenAI
import os
import sys

_USE_COLOR = sys.stdout.isatty() and os.getenv("NO_COLOR") is None
_REASONING_COLOR = "\033[90m" if _USE_COLOR else ""
_RESET_COLOR = "\033[0m" if _USE_COLOR else ""


def main() -> None:
    api_key = os.getenv("NVIDIA_API_KEY")
    if not api_key:
        raise RuntimeError("Set NVIDIA_API_KEY before running this script.")

    client = OpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=api_key,
    )

    prompt = " ".join(sys.argv[1:]).strip()
    if not prompt:
        prompt = input("You: ").strip()
    if not prompt:
        raise RuntimeError("Provide a prompt as an argument or via input.")

    completion = client.chat.completions.create(
        model="z-ai/glm4.7",
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        temperature=1,
        top_p=1,
        max_tokens=4096,
        extra_body={
            "chat_template_kwargs": {
                "enable_thinking": True,
                "clear_thinking": False,
            }
        },
        stream=True,
    )

    print("AI: ", end="")
    for chunk in completion:
        if not getattr(chunk, "choices", None):
            continue
        if len(chunk.choices) == 0 or getattr(chunk.choices[0], "delta", None) is None:
            continue

        delta = chunk.choices[0].delta
        reasoning = getattr(delta, "reasoning_content", None)
        if reasoning:
            print(f"{_REASONING_COLOR}{reasoning}{_RESET_COLOR}", end="")

        if getattr(delta, "content", None):
            print(delta.content, end="")

    print()


if __name__ == "__main__":
    main()

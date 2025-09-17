from langchain_community.tools import WikipediaQueryRun, DuckDuckGoSearchRun
from langchain_community.utilities import WikipediaAPIWrapper
from langchain.tools import Tool
from datetime import datetime

def save_to_file(data: str, filename: str = "options.txt"):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    formatted_text = f"---\n# Saved on {timestamp}\n{data}\n---\n"
    with open(filename, "a", encoding="utf-8") as file:
        file.write(formatted_text)
    return f"Data saved successfully to {filename}"


save_tool = Tool(
    name="save_to_file",
    func=save_to_file,
    description="Saves the provided data to a text file with a timestamp if asked to. Input should be the data to save.",
)

search = DuckDuckGoSearchRun()
wikipedia = WikipediaAPIWrapper(top_k_results=3, lang="en", doc_content_chars_max=1000)

search_tool = Tool(
    name="search",
    func=search.run,
    description="Useful for when you need to look up current events or find information that is not in your training data. Input should be a search query.",
)

wiki_tool = Tool(
    name="wikipedia",
    func=wikipedia.run,
    description="Useful for when you need to look up information about people, places, or things. Input should be a search query.",
)
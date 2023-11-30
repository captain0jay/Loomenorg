import sys
from hugchat import hugchat
from hugchat.login import Login
import json

# Log in to huggingface and grant authorization to huggingchat
email=""
passwd=""
sign = Login(email, passwd)
cookies = sign.login()

# Save cookies to the local directory
cookie_path_dir = "./cookies_snapshot"
sign.saveCookiesToDir(cookie_path_dir)

#sign = login(email, None)
#cookies = sign.loadCookiesFromDir(cookie_path_dir) # This will detect if the JSON file exists, return cookies if it does and raise an Exception if it's not.

chatbot = hugchat.ChatBot(cookies=cookies.get_dict())
file_path = "prompt.txt"
with open(file_path, "r") as file:
    file_content = file.read()
prompt = "1.User prompt:" + sys.argv[1] + file_content
query_result = chatbot.query(prompt)
parsed_json = json.dumps(query_result)
print(parsed_json)
#for resp in chatbot.query(
 #   ,
 #   stream=False
#):
 #   print(resp)

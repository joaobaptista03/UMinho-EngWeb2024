import json
import requests

json_file_paths = [
    "datasets/dataset-extra1.json",
    "datasets/dataset-extra2.json",
    "datasets/dataset-extra3.json"
]

api_endpoint = "http://localhost:7777/pessoas"

for json_file_path in json_file_paths:
    with open(json_file_path, "r") as json_file:
        json_data = json.load(json_file)

        for data in json_data:            
            response = requests.post(api_endpoint, json=data, headers={"Content-Type": "application/json"})
            
            if response.status_code == 201:
                print(f"{data['nome']} sent successfully. Status code: {response.status_code}")
            else:
                print("Failed to send data. Status code:", response.status_code)
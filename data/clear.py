import json

def remove_duplicates_by_food_name(input_file, output_file):
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)

        unique = []
        seen = set()

        for item in data:
            food_name = item.get("Food Item")  # key to check duplicates
            if food_name and food_name not in seen:
                seen.add(food_name)
                unique.append(item)

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(unique, f, ensure_ascii=False, indent=2)

        print(f"Done! Removed duplicates based on 'Food Item'.")
        print(f"Saved cleaned file as: {output_file}")

    except Exception as e:
        print("Error:", e)


# Run here
if __name__ == "__main__":
    remove_duplicates_by_food_name("input.json", "cleaned_output.json")

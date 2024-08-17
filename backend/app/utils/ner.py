from transformers import pipeline, AutoTokenizer, AutoModelForTokenClassification

model_name = "tner/roberta-large-mit-restaurant"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForTokenClassification.from_pretrained(model_name)

pipe = pipeline("token-classification", model=model, tokenizer=tokenizer)

def parse_ner(user_prompt):
    parsed_input = {'Budget': [], 'Cuisine/ Preference': [], 'Dish': []}
    for entity in pipe(user_prompt):
        if entity['entity'] == 'B-Price' or entity['entity'] == 'I-Price':
            parsed_input['Budget'].append(entity['word'][1:])
        elif entity['entity'] == 'B-Cuisine' or entity['entity'] == 'I-Cuisine':
            parsed_input['Cuisine/ Preference'].append(entity['word'][1:])
        elif entity['entity'] == 'B-Dish' or entity['entity'] == 'I-Dish':
            parsed_input['Dish'].append(entity['word'][1:])
    return parsed_input

import backoff
import openai
import logging

# Initialize OpenAI API (make sure to set your API key)
openai.api_key = 'sk-St-FBqktAlcNXAZIRB-PlagoWXXtlI-RmWtT96jqnGT3BlbkFJiC_Vje_bRtwecy9Phyt8Fclv5C0SqdMDXe1E_qbDwA'

# Configure logging to display debug information
logging.basicConfig(level=logging.DEBUG)

@backoff.on_exception(backoff.expo, openai.error.RateLimitError)
def completions_with_backoff(**kwargs):
    logging.debug("Calling OpenAI API with parameters: %s", kwargs)
    try:
        response = openai.ChatCompletion.create(**kwargs)
        logging.debug("Received response from OpenAI API: %s", response)
        return response
    except openai.error.OpenAIError as e:
        logging.error("Error occurred while calling OpenAI API: %s", e)
        raise

# Test the function with a sample prompt
response = completions_with_backoff(model="gpt-3.5-turbo", messages=[{"role": "user", "content": "Once upon a time,"}])
poem = response['choices'][0]['message']['content'].strip()
print(poem)

import nltk
import os
import shutil

nltk_data_dir = '/root/nltk_data'
punkt_dir = os.path.join(nltk_data_dir, 'tokenizers', 'punkt')

if os.path.exists(punkt_dir):
    shutil.rmtree(punkt_dir)

nltk.download('punkt')
nltk.download('stopwords')

from nltk.corpus import stopwords
from nltk.classify import NaiveBayesClassifier
from nltk.classify.util import accuracy

def manual_tokenize(text):
    words = text.split()
    return [word.strip().lower() for word in words if word.isalnum()]

def preprocess_text(text):
    words = manual_tokenize(text)
    stop_words = set(stopwords.words('english'))
    words = [word for word in words if word not in stop_words]
    return words

def extract_features(words):
    return {word: True for word in words}

train_data = [
    ("I love programming", "Positive"),
    ("Python is great", "Positive"),
    ("I hate bugs", "Negative"),
    ("This is frustrating", "Negative"),
    ("Amazing experience", "Positive"),
    ("This is awful", "Negative"),
    ("I enjoy learning", "Positive"),
    ("Learning is fun", "Positive"),
    ("I hate Python", "Negative"),
    ("I'm not sure about coding", "Negative"),
    ("This coding experience is okay", "Positive"),
    ("Python is frustrating", "Positive"),
    ("I hate learning new things", "Positive"),
    ("This is okay but not great", "Negative")
]

train_features = [(extract_features(preprocess_text(sentence)), category) for sentence, category in train_data]

classifier = NaiveBayesClassifier.train(train_features)

test_sentence = "I enjoy coding and solving problems"

test_words = preprocess_text(test_sentence)
test_features = extract_features(test_words)

predicted_category = classifier.classify(test_features)
print(f"The predicted category for the sentence is: {predicted_category}")

accuracy_rate = accuracy(classifier, train_features)
print(f"Accuracy on training data: {accuracy_rate * 100:.2f}%")

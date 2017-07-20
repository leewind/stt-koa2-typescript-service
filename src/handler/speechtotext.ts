import { CreateRecognizer } from "../vendor/microsoft/stt/sdk/speech.server/Exports"
import { 
  SpeechRecognitionResultEvent, 
  Recognizer, 
  CognitiveSubscriptionKeyAuthentication, 
  Device, 
  OS, 
  RecognizerConfig, 
  Context, 
  SpeechConfig, 
  RecognitionMode, 
  SpeechResultFormat 
} from "../vendor/microsoft/stt/sdk/speech/Exports"

import {
  LogDebug,
} from "../vendor/microsoft/stt/common/Exports"

const SimulatedUserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36";

const RecognizerSetup = (recognitionMode: RecognitionMode, language: string, format: SpeechResultFormat, subscriptionKey: string): Recognizer => {
  var recognizerConfig = new RecognizerConfig(
    new SpeechConfig(
      new Context(
        new OS(SimulatedUserAgent, "Browser", null),
        new Device("SpeechSample", "SpeechSample", "1.0.00000"))),
    recognitionMode, // SDK.RecognitionMode.Interactive  (Options - Interactive/Conversation/Dictation>)
    language, // Supported laguages are specific to each recognition mode. Refer to docs.
    format); // SDK.SpeechResultFormat.Simple (Options - Simple/Detailed)

  // Alternatively use SDK.CognitiveTokenAuthentication(fetchCallback, fetchOnExpiryCallback) for token auth
  var authentication = new CognitiveSubscriptionKeyAuthentication(subscriptionKey);

  return CreateRecognizer(recognizerConfig, authentication);
}

const RecognizerStart = (recognizer: Recognizer): void => {
  recognizer.Recognize((event: any) => {
    /*
     Alternative syntax for typescript devs.
     if (event instanceof SDK.RecognitionTriggeredEvent)
    */
    switch (event.Name) {
      case "RecognitionTriggeredEvent":
        LogDebug("Initializing");
        break;
      case "ListeningStartedEvent":
        LogDebug("Listening");
        break;
      case "RecognitionStartedEvent":
        LogDebug("Listening_Recognizing");
        break;
      case "SpeechStartDetectedEvent":
        LogDebug("Listening_DetectedSpeech_Recognizing");
        console.log(JSON.stringify(event.Result)); // check console for other information in result
        break;
      case "SpeechHypothesisEvent":
        LogDebug(event.Result.Text);
        console.log(JSON.stringify(event.Result)); // check console for other information in result
        break;
      case "SpeechEndDetectedEvent":
        // OnSpeechEndDetected();
        LogDebug("Processing_Adding_Final_Touches");
        console.log(JSON.stringify(event.Result)); // check console for other information in result
        break;
      case "SpeechSimplePhraseEvent":
        LogDebug(JSON.stringify(event.Result, null, 3));
        break;
      case "SpeechDetailedPhraseEvent":
        LogDebug(JSON.stringify(event.Result, null, 3));
        break;
      case "RecognitionEndedEvent":
        // OnComplete();
        LogDebug("Idle");
        console.log(JSON.stringify(event)); // Debug information
        break;
    }
  })
    .On(() => {
      // The request succeeded. Nothing to do here.
    },
    (error) => {
      console.error(error);
    });
}

const RecognizerStop = (recognizer: Recognizer): void => {
  // recognizer.AudioSource.Detach(audioNodeId) can be also used here. (audioNodeId is part of ListeningStartedEvent)
  recognizer.AudioSource.TurnOff();
}

export { RecognizerSetup, RecognizerStart, RecognizerStop }
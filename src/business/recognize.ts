import { readFile } from 'fs';
import { CreateRecognizerWithPcmRecorderByInputBuffer } from "../vendor/microsoft/stt/sdk/speech.server/Exports"
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
  LogError,
  Events,
  PlatformEvent,
} from "../vendor/microsoft/stt/common/Exports"

const SimulatedUserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36";

const RecognizerSetup = (recognitionMode: RecognitionMode, language: string, format: SpeechResultFormat, subscriptionKey: string, buffer: Buffer): Recognizer => {
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

  return CreateRecognizerWithPcmRecorderByInputBuffer(recognizerConfig, authentication, buffer);
}

const RecognizerStart = (recognizer: Recognizer, callback: any): Promise<Array<any>> => {
  return new Promise((resolve, reject) => {
    let messages = new Array<any>();

    let EventTrigger = Events.Instance.Attach((event: any) => {
      switch (event.Name) {
        case "ConnectionEstablishErrorEvent":
          LogDebug("ConnectionEstablishErrorEvent");
          callback()
          EventTrigger.Detach();
          // reject('Connection Closed');
          
          break;
        case "ConnectionClosedEvent":
          LogDebug("ConnectionClosedEvent");
          callback()
          EventTrigger.Detach();
          // reject('Connection Closed');
          
          break;
        case "RecognitionTriggeredEvent":
          LogDebug("#RecognitionTriggeredEvent");
          break;
        case "ListeningStartedEvent":
          LogDebug("#Listening");
          break;
        case "RecognitionStartedEvent":
          LogDebug("#Listening_Recognizing");
          break;
        case "SpeechStartDetectedEvent":
          LogDebug("#SpeechStartDetectedEvent");
          LogDebug(JSON.stringify(event.Result)); // check console for other information in result
          break;
        case "SpeechHypothesisEvent":
          LogDebug("#SpeechHypothesisEvent")
          LogDebug(event.Result.Text);
          LogDebug(JSON.stringify(event.Result)); // check console for other information in result
          break;
        case "SpeechEndDetectedEvent":
          LogDebug("#SpeechEndDetectedEvent");
          LogDebug(JSON.stringify(event.Result)); // check console for other information in result
          break;
        case "SpeechSimplePhraseEvent":
          messages.push(event.Result);
          LogDebug("#SpeechSimplePhraseEvent")
          LogDebug(JSON.stringify(event.Result, null, 3));

          break;
        case "SpeechDetailedPhraseEvent":
          LogDebug("#SpeechDetailedPhraseEvent")
          LogDebug(JSON.stringify(event.Result, null, 3));
          break;
        case "RecognitionEndedEvent":
          LogDebug("#RecognitionEndedEvent");
          LogDebug(JSON.stringify(event)); // Debug information

          // EventTrigger.Detach();
          resolve(messages);
          break;
      }
    })
    recognizer.Recognize((event: any) => {
      /*
      Alternative syntax for typescript devs.
      if (event instanceof SDK.RecognitionTriggeredEvent)
      */
    })
      .On(() => {
        // The request succeeded. Nothing to do here.
      },
      (error) => {
        LogError(error);
      });
  });
}

const RecognizerStop = (recognizer: Recognizer): void => {
  // recognizer.AudioSource.Detach(audioNodeId) can be also used here. (Promise is part of ListeningStartedEvent)
  recognizer.AudioSource.TurnOff();
}

const ReadFile = (filepath: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    readFile(filepath, (err, buffer: Buffer) => {
      if (err) {
        reject(err);
      }
      resolve(buffer);
    });
  });

};

export {
  RecognizerSetup,
  RecognizerStart,
  RecognizerStop,
  ReadFile
}
import { AccidentalCountKeyChoiceExercise } from "@/components/exercises/AccidentalCountKeyChoiceExercise";
import { BeamGroupingChoiceExercise } from "@/components/exercises/BeamGroupingChoiceExercise";
import { CircleNeighborKeyChoiceExercise } from "@/components/exercises/CircleNeighborKeyChoiceExercise";
import { CircleStepChoiceExercise } from "@/components/exercises/CircleStepChoiceExercise";
import { ClefTraceExercise } from "@/components/exercises/ClefTraceExercise";
import { DominantSeventhInversionChoiceExercise } from "@/components/exercises/DominantSeventhInversionChoiceExercise";
import { IntervalBuildChoiceExercise } from "@/components/exercises/IntervalBuildChoiceExercise";
import { IntervalBuildStaffChoiceExercise } from "@/components/exercises/IntervalBuildStaffChoiceExercise";
import { IntervalDistanceChoiceExercise } from "@/components/exercises/IntervalDistanceChoiceExercise";
import { IntervalNameChoiceExercise } from "@/components/exercises/IntervalNameChoiceExercise";
import { IntervalTimedTestExercise } from "@/components/exercises/IntervalTimedTestExercise";
import { KeyFactChoiceExercise } from "@/components/exercises/KeyFactChoiceExercise";
import { KeySignatureNamesChoiceExercise } from "@/components/exercises/KeySignatureNamesChoiceExercise";
import { KeySignatureStaffChoiceExercise } from "@/components/exercises/KeySignatureStaffChoiceExercise";
import { LineOrSpaceChoiceExercise } from "@/components/exercises/LineOrSpaceChoiceExercise";
import { MelodicRhythmicDictationExercise } from "@/components/exercises/MelodicRhythmicDictationExercise";
import { MelodyDirectionExercise } from "@/components/exercises/MelodyDirectionExercise";
import { MeterChoiceExercise } from "@/components/exercises/MeterChoiceExercise";
import { MultipleChoiceNotationExercise } from "@/components/exercises/MultipleChoiceNotationExercise";
import { NoteSequencingExercise } from "@/components/exercises/NoteSequencingExercise";
import { NoteWordSpellingExercise } from "@/components/exercises/NoteWordSpellingExercise";
import { PitchHeightChoiceExercise } from "@/components/exercises/PitchHeightChoiceExercise";
import { PulseTapExercise } from "@/components/exercises/PulseTapExercise";
import { RelativeKeyChoiceExercise } from "@/components/exercises/RelativeKeyChoiceExercise";
import { RhythmDictationExercise } from "@/components/exercises/RhythmDictationExercise";
import { RhythmEchoExercise } from "@/components/exercises/RhythmEchoExercise";
import { RhythmMathChoiceExercise } from "@/components/exercises/RhythmMathChoiceExercise";
import { RhythmNotationTapExercise } from "@/components/exercises/RhythmNotationTapExercise";
import { RhythmSequencingExercise } from "@/components/exercises/RhythmSequencingExercise";
import { RhythmValueDictationExercise } from "@/components/exercises/RhythmValueDictationExercise";
import { SolfegeNoteSingingExercise } from "@/components/exercises/SolfegeNoteSingingExercise";
import { SolfegePhraseSingingExercise } from "@/components/exercises/SolfegePhraseSingingExercise";
import { StaffPlacementExercise } from "@/components/exercises/StaffPlacementExercise";
import { TriadBuildStaffChoiceExercise } from "@/components/exercises/TriadBuildStaffChoiceExercise";
import { TriadFactChoiceExercise } from "@/components/exercises/TriadFactChoiceExercise";
import { TriadInversionChoiceExercise } from "@/components/exercises/TriadInversionChoiceExercise";
import { TriadNotesChoiceExercise } from "@/components/exercises/TriadNotesChoiceExercise";
import { TriadQualityChoiceExercise } from "@/components/exercises/TriadQualityChoiceExercise";
import { TriadRoleChoiceExercise } from "@/components/exercises/TriadRoleChoiceExercise";
import { dropLastIndexFromGroups, toggleGroupBoundary } from "@/lib/rhythm/beamGrouping";
import type { Locale } from "@/types/locale";
import type { AnswerInput, GeneratedExercise } from "@/types/exercises";

interface ExerciseRendererProps {
  exercise: GeneratedExercise;
  answer: AnswerInput | null;
  onAnswerChange: (answer: AnswerInput) => void;
  checked: boolean;
  isCorrect: boolean | null;
  locale: Locale;
  /** Only meaningful for "clef-trace" — see ClefTraceBoard's own doc for
   * why the hosting screen needs to know a stroke is in progress. Every
   * other exercise type ignores this. */
  onDrawingActiveChange?: (active: boolean) => void;
}

/**
 * Single place that knows the exercise-type -> component mapping — mirrors
 * the web app's own ExerciseRenderer.tsx switch shape (one case per type,
 * each case owning its own AnswerInput construction). Adding a 10th
 * exercise type (for the next world ported after Wioska Nut) means adding
 * one case here, not touching LessonScreen.
 */
export function ExerciseRenderer({ exercise, answer, onAnswerChange, checked, isCorrect, locale, onDrawingActiveChange }: ExerciseRendererProps) {
  switch (exercise.type) {
    case "clef-trace":
      return (
        <ClefTraceExercise
          exercise={exercise}
          points={answer?.type === "clef-trace" ? answer.points : []}
          onCommit={(points) => onAnswerChange({ type: "clef-trace", points })}
          checked={checked}
          isCorrect={isCorrect}
          locale={locale}
          onDrawingActiveChange={onDrawingActiveChange}
        />
      );
    case "interval-distance-choice":
      return (
        <IntervalDistanceChoiceExercise
          exercise={exercise}
          selectedMotion={answer?.type === "interval-distance-choice" ? answer.selectedMotion : null}
          onSelect={(selectedMotion) => onAnswerChange({ type: "interval-distance-choice", selectedMotion })}
          checked={checked}
          locale={locale}
        />
      );
    case "line-or-space-choice":
      return (
        <LineOrSpaceChoiceExercise
          exercise={exercise}
          selectedAnswer={answer?.type === "line-or-space-choice" ? answer.selectedAnswer : null}
          onSelect={(selectedAnswer) => onAnswerChange({ type: "line-or-space-choice", selectedAnswer })}
          checked={checked}
          locale={locale}
        />
      );
    case "melody-direction-choice":
      return (
        <MelodyDirectionExercise
          exercise={exercise}
          selectedDirection={answer?.type === "melody-direction-choice" ? answer.selectedDirection : null}
          onSelect={(selectedDirection) => onAnswerChange({ type: "melody-direction-choice", selectedDirection })}
          checked={checked}
          locale={locale}
        />
      );
    case "multiple-choice-notation":
      return (
        <MultipleChoiceNotationExercise
          exercise={exercise}
          selectedOptionId={answer?.type === "multiple-choice-notation" ? answer.selectedOptionId : null}
          onSelect={(selectedOptionId) => onAnswerChange({ type: "multiple-choice-notation", selectedOptionId })}
          checked={checked}
          locale={locale}
        />
      );
    case "note-sequencing":
      return (
        <NoteSequencingExercise
          exercise={exercise}
          selectedOrder={answer?.type === "note-sequencing" ? answer.selectedOrder : []}
          onSelect={(selectedOrder) => onAnswerChange({ type: "note-sequencing", selectedOrder })}
          checked={checked}
          locale={locale}
        />
      );
    case "note-word-spelling":
      return (
        <NoteWordSpellingExercise
          exercise={exercise}
          guess={answer?.type === "note-word-spelling" ? answer.guess : ""}
          onGuessChange={(guess) => onAnswerChange({ type: "note-word-spelling", guess })}
          checked={checked}
          locale={locale}
        />
      );
    case "pitch-height-choice":
      return (
        <PitchHeightChoiceExercise
          exercise={exercise}
          selectedSide={answer?.type === "pitch-height-choice" ? answer.selectedSide : null}
          onSelect={(selectedSide) => onAnswerChange({ type: "pitch-height-choice", selectedSide })}
          checked={checked}
          locale={locale}
        />
      );
    case "staff-placement":
      return (
        <StaffPlacementExercise
          exercise={exercise}
          selectedStep={answer?.type === "staff-placement" ? answer.selectedStep : null}
          onSelect={(selectedStep) => onAnswerChange({ type: "staff-placement", selectedStep })}
          checked={checked}
          locale={locale}
        />
      );
    case "pulse-tap":
      return (
        <PulseTapExercise
          exercise={exercise}
          answer={answer?.type === "pulse-tap" ? answer : null}
          onAnswerChange={onAnswerChange}
          checked={checked}
          locale={locale}
        />
      );
    case "meter-choice":
      return (
        <MeterChoiceExercise
          exercise={exercise}
          answer={answer?.type === "meter-choice" ? answer : null}
          onAnswerChange={onAnswerChange}
          checked={checked}
          locale={locale}
        />
      );
    case "rhythm-echo":
      return (
        <RhythmEchoExercise
          exercise={exercise}
          answer={answer?.type === "rhythm-echo" ? answer : null}
          onAnswerChange={onAnswerChange}
          checked={checked}
          locale={locale}
        />
      );
    case "rhythm-sequencing":
      return (
        <RhythmSequencingExercise
          exercise={exercise}
          answer={answer?.type === "rhythm-sequencing" ? answer : null}
          onAnswerChange={onAnswerChange}
          checked={checked}
          locale={locale}
        />
      );
    case "rhythm-dictation":
      return (
        <RhythmDictationExercise
          exercise={exercise}
          answer={answer?.type === "rhythm-dictation" ? answer : null}
          onAnswerChange={onAnswerChange}
          checked={checked}
          locale={locale}
        />
      );
    case "rhythm-notation-tap":
      return (
        <RhythmNotationTapExercise
          exercise={exercise}
          answer={answer?.type === "rhythm-notation-tap" ? answer : null}
          onAnswerChange={onAnswerChange}
          checked={checked}
          locale={locale}
        />
      );
    case "interval-name-choice":
      return (
        <IntervalNameChoiceExercise
          exercise={exercise}
          selectedOptionId={answer?.type === "interval-name-choice" ? answer.selectedOptionId : null}
          onSelect={(selectedOptionId) => onAnswerChange({ type: "interval-name-choice", selectedOptionId })}
          checked={checked}
          locale={locale}
        />
      );
    case "interval-timed-test":
      return (
        <IntervalTimedTestExercise
          exercise={exercise}
          answer={answer?.type === "interval-timed-test" ? answer : null}
          onAnswerChange={onAnswerChange}
          checked={checked}
          locale={locale}
        />
      );
    case "triad-notes-choice":
      return (
        <TriadNotesChoiceExercise
          exercise={exercise}
          selectedOptionId={answer?.type === "triad-notes-choice" ? answer.selectedOptionId : null}
          onSelect={(selectedOptionId) => onAnswerChange({ type: "triad-notes-choice", selectedOptionId })}
          checked={checked}
          locale={locale}
        />
      );
    case "triad-fact-choice":
      return (
        <TriadFactChoiceExercise
          exercise={exercise}
          selectedOptionId={answer?.type === "triad-fact-choice" ? answer.selectedOptionId : null}
          onSelect={(selectedOptionId) => onAnswerChange({ type: "triad-fact-choice", selectedOptionId })}
          checked={checked}
        />
      );
    case "triad-quality-choice":
      return (
        <TriadQualityChoiceExercise
          exercise={exercise}
          selectedOptionId={answer?.type === "triad-quality-choice" ? answer.selectedOptionId : null}
          onSelect={(selectedOptionId) => onAnswerChange({ type: "triad-quality-choice", selectedOptionId })}
          checked={checked}
          locale={locale}
        />
      );
    case "triad-inversion-choice":
      return (
        <TriadInversionChoiceExercise
          exercise={exercise}
          selectedOptionId={answer?.type === "triad-inversion-choice" ? answer.selectedOptionId : null}
          onSelect={(selectedOptionId) => onAnswerChange({ type: "triad-inversion-choice", selectedOptionId })}
          checked={checked}
          locale={locale}
        />
      );
    case "dominant-seventh-inversion-choice":
      return (
        <DominantSeventhInversionChoiceExercise
          exercise={exercise}
          selectedOptionId={answer?.type === "dominant-seventh-inversion-choice" ? answer.selectedOptionId : null}
          onSelect={(selectedOptionId) => onAnswerChange({ type: "dominant-seventh-inversion-choice", selectedOptionId })}
          checked={checked}
          locale={locale}
        />
      );
    case "triad-role-choice":
      return (
        <TriadRoleChoiceExercise
          exercise={exercise}
          selectedOptionId={answer?.type === "triad-role-choice" ? answer.selectedOptionId : null}
          onSelect={(selectedOptionId) => onAnswerChange({ type: "triad-role-choice", selectedOptionId })}
          checked={checked}
          locale={locale}
        />
      );
    case "circle-step-choice":
      return (
        <CircleStepChoiceExercise
          exercise={exercise}
          selectedFifths={answer?.type === "circle-step-choice" ? answer.selectedFifths : null}
          onSelect={(selectedFifths) => onAnswerChange({ type: "circle-step-choice", selectedFifths })}
          checked={checked}
          locale={locale}
        />
      );
    case "relative-key-choice":
      return (
        <RelativeKeyChoiceExercise
          exercise={exercise}
          selectedFifths={answer?.type === "relative-key-choice" ? answer.selectedFifths : null}
          onSelect={(selectedFifths) => onAnswerChange({ type: "relative-key-choice", selectedFifths })}
          checked={checked}
          locale={locale}
        />
      );
    case "key-fact-choice":
      return (
        <KeyFactChoiceExercise
          exercise={exercise}
          selectedOptionId={answer?.type === "key-fact-choice" ? answer.selectedOptionId : null}
          onSelect={(selectedOptionId) => onAnswerChange({ type: "key-fact-choice", selectedOptionId })}
          checked={checked}
        />
      );
    case "key-signature-names-choice":
      return (
        <KeySignatureNamesChoiceExercise
          exercise={exercise}
          selectedOptionId={answer?.type === "key-signature-names-choice" ? answer.selectedOptionId : null}
          onSelect={(selectedOptionId) => onAnswerChange({ type: "key-signature-names-choice", selectedOptionId })}
          checked={checked}
          locale={locale}
        />
      );
    case "circle-neighbor-key-choice":
      return (
        <CircleNeighborKeyChoiceExercise
          exercise={exercise}
          selectedOptionId={answer?.type === "circle-neighbor-key-choice" ? answer.selectedOptionId : null}
          onSelect={(selectedOptionId) => onAnswerChange({ type: "circle-neighbor-key-choice", selectedOptionId })}
          checked={checked}
          locale={locale}
        />
      );
    case "key-signature-staff-choice":
      return (
        <KeySignatureStaffChoiceExercise
          exercise={exercise}
          selectedOptionId={answer?.type === "key-signature-staff-choice" ? answer.selectedOptionId : null}
          onSelect={(selectedOptionId) => onAnswerChange({ type: "key-signature-staff-choice", selectedOptionId })}
          checked={checked}
          locale={locale}
        />
      );
    case "accidental-count-key-choice":
      return (
        <AccidentalCountKeyChoiceExercise
          exercise={exercise}
          selectedOptionId={answer?.type === "accidental-count-key-choice" ? answer.selectedOptionId : null}
          onSelect={(selectedOptionId) => onAnswerChange({ type: "accidental-count-key-choice", selectedOptionId })}
          checked={checked}
          locale={locale}
        />
      );
    case "interval-build-choice":
      return (
        <IntervalBuildChoiceExercise
          exercise={exercise}
          selectedNote={answer?.type === "interval-build-choice" ? answer.selectedNote : null}
          onSelect={(selectedNote) => onAnswerChange({ type: "interval-build-choice", selectedNote })}
          checked={checked}
          locale={locale}
        />
      );
    case "interval-build-staff-choice": {
      const currentAnswer = answer?.type === "interval-build-staff-choice" ? answer : null;
      return (
        <IntervalBuildStaffChoiceExercise
          exercise={exercise}
          selectedStep={currentAnswer?.selectedStep ?? null}
          selectedAccidental={currentAnswer?.selectedAccidental ?? 0}
          onSelectStep={(selectedStep) =>
            onAnswerChange({ type: "interval-build-staff-choice", selectedStep, selectedAccidental: currentAnswer?.selectedAccidental ?? 0 })
          }
          onSelectAccidental={(selectedAccidental) =>
            onAnswerChange({ type: "interval-build-staff-choice", selectedStep: currentAnswer?.selectedStep ?? null, selectedAccidental })
          }
          checked={checked}
          locale={locale}
        />
      );
    }
    case "triad-build-staff-choice": {
      const currentAnswer = answer?.type === "triad-build-staff-choice" ? answer : null;
      const selectedThirdStep = currentAnswer?.selectedThirdStep ?? null;
      const selectedThirdAccidental = currentAnswer?.selectedThirdAccidental ?? 0;
      const selectedFifthStep = currentAnswer?.selectedFifthStep ?? null;
      const selectedFifthAccidental = currentAnswer?.selectedFifthAccidental ?? 0;
      return (
        <TriadBuildStaffChoiceExercise
          exercise={exercise}
          selectedThirdStep={selectedThirdStep}
          selectedThirdAccidental={selectedThirdAccidental}
          selectedFifthStep={selectedFifthStep}
          selectedFifthAccidental={selectedFifthAccidental}
          onSelectThirdStep={(step) =>
            onAnswerChange({
              type: "triad-build-staff-choice",
              selectedThirdStep: step,
              selectedThirdAccidental,
              selectedFifthStep,
              selectedFifthAccidental,
            })
          }
          onSelectThirdAccidental={(accidental) =>
            onAnswerChange({
              type: "triad-build-staff-choice",
              selectedThirdStep,
              selectedThirdAccidental: accidental,
              selectedFifthStep,
              selectedFifthAccidental,
            })
          }
          onSelectFifthStep={(step) =>
            onAnswerChange({
              type: "triad-build-staff-choice",
              selectedThirdStep,
              selectedThirdAccidental,
              selectedFifthStep: step,
              selectedFifthAccidental,
            })
          }
          onSelectFifthAccidental={(accidental) =>
            onAnswerChange({
              type: "triad-build-staff-choice",
              selectedThirdStep,
              selectedThirdAccidental,
              selectedFifthStep,
              selectedFifthAccidental: accidental,
            })
          }
          checked={checked}
          locale={locale}
        />
      );
    }
    case "beam-grouping-choice":
      return (
        <BeamGroupingChoiceExercise
          exercise={exercise}
          selectedIndex={answer?.type === "beam-grouping-choice" ? answer.selectedIndex : null}
          onSelect={(selectedIndex) => onAnswerChange({ type: "beam-grouping-choice", selectedIndex })}
          checked={checked}
          locale={locale}
        />
      );
    case "rhythm-math-choice":
      return (
        <RhythmMathChoiceExercise
          exercise={exercise}
          selectedIndex={answer?.type === "rhythm-math-choice" ? answer.selectedIndex : null}
          onSelect={(selectedIndex) => onAnswerChange({ type: "rhythm-math-choice", selectedIndex })}
          checked={checked}
          locale={locale}
        />
      );
    case "rhythm-value-dictation": {
      const currentAnswer = answer?.type === "rhythm-value-dictation" ? answer : null;
      const sequence = currentAnswer?.sequence ?? [];
      const groups = currentAnswer?.groups ?? [];
      return (
        <RhythmValueDictationExercise
          exercise={exercise}
          sequence={sequence}
          groups={groups}
          onAddValue={(value) =>
            onAnswerChange({ type: "rhythm-value-dictation", sequence: [...sequence, value], groups: [...groups, [sequence.length]] })
          }
          onUndo={() =>
            onAnswerChange({ type: "rhythm-value-dictation", sequence: sequence.slice(0, -1), groups: dropLastIndexFromGroups(groups) })
          }
          onToggleBoundary={(boundaryIndex) =>
            onAnswerChange({ type: "rhythm-value-dictation", sequence, groups: toggleGroupBoundary(groups, boundaryIndex) })
          }
          checked={checked}
          locale={locale}
        />
      );
    }
    case "melodic-rhythmic-dictation": {
      const currentAnswer = answer?.type === "melodic-rhythmic-dictation" ? answer : null;
      const notes = currentAnswer?.notes ?? [];
      const groups = currentAnswer?.groups ?? [];
      return (
        <MelodicRhythmicDictationExercise
          exercise={exercise}
          notes={notes}
          groups={groups}
          onAddNote={(note) =>
            onAnswerChange({ type: "melodic-rhythmic-dictation", notes: [...notes, note], groups: [...groups, [notes.length]] })
          }
          onUndo={() =>
            onAnswerChange({ type: "melodic-rhythmic-dictation", notes: notes.slice(0, -1), groups: dropLastIndexFromGroups(groups) })
          }
          onToggleBoundary={(boundaryIndex) =>
            onAnswerChange({ type: "melodic-rhythmic-dictation", notes, groups: toggleGroupBoundary(groups, boundaryIndex) })
          }
          checked={checked}
          isCorrect={isCorrect}
          locale={locale}
        />
      );
    }
    case "solfege-note-singing":
      return (
        <SolfegeNoteSingingExercise
          exercise={exercise}
          answer={answer?.type === "solfege-note-singing" ? answer : null}
          onAnswerChange={onAnswerChange}
          checked={checked}
          locale={locale}
        />
      );
    case "solfege-phrase-singing":
      return (
        <SolfegePhraseSingingExercise
          exercise={exercise}
          answer={answer?.type === "solfege-phrase-singing" ? answer : null}
          onAnswerChange={onAnswerChange}
          checked={checked}
          locale={locale}
        />
      );
  }
}

/** Whether `answer` has enough to enable the "Sprawdź" button — an empty
 * text guess, a not-yet-drawn trace, or no selection yet all count as
 * "nothing to check". */
export function hasAnswerToCheck(answer: AnswerInput | null): boolean {
  if (!answer) return false;
  switch (answer.type) {
    case "clef-trace":
      return answer.points.length > 1;
    case "note-sequencing":
      return answer.selectedOrder.length > 0;
    case "note-word-spelling":
      return answer.guess.trim().length > 0;
    case "rhythm-sequencing":
      return answer.selectedIndexes.length > 0;
    case "pulse-tap":
    case "rhythm-echo":
    case "rhythm-dictation":
    case "rhythm-notation-tap":
      return answer.tapTimestampsMs.length > 0;
    case "interval-build-staff-choice":
      return answer.selectedStep !== null;
    case "triad-build-staff-choice":
      return answer.selectedThirdStep !== null && answer.selectedFifthStep !== null;
    case "rhythm-value-dictation":
      return answer.sequence.length > 0;
    case "melodic-rhythmic-dictation":
      return answer.notes.length > 0;
    case "solfege-note-singing":
      return answer.detectedFrequencyHz !== null;
    case "solfege-phrase-singing":
      return answer.detectedFrequenciesHz.some((frequencyHz) => frequencyHz !== null);
    default:
      return true;
  }
}

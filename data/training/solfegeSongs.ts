import type { ExerciseDefinition } from "@/types/exercises";

/**
 * Extra songs for Tryb własny's "Solfeż i piosenki": more well-known tunes to sing from the notes (with the microphone, or without it: not everybody
 * sings in tune, so the 🎤 and 🥁 switches choose between a graded take, a sing-along with the metronome, or just a sing-along), on top of the
 * fragments the game's own Zaczarowany Solfeż already teaches (Panie Janie, Oda do radości, Twinkle twinkle, …). All are in C major
 * between C4 and C5, short, and written as one phrase each so a child can sing them. Each phrase must fill whole measures (checked by a test).
 *
 * The melodies are traditional / public domain and written from memory of the standard versions: have a musician look them over
 * before relying on them (the rhythm of the second halves of "Jingle Bells" and "London Bridge" is deliberately left out, as it varies).
 */
function song(id: string, notes: string[], rhythm: NonNullable<Extract<ExerciseDefinition["spec"], { type: "solfege-phrase-singing" }>["rhythm"]>, meter: "4/4" | "6/8", label: string): ExerciseDefinition {
  return {
    id,
    type: "solfege-phrase-singing",
    difficulty: 3,
    spec: { type: "solfege-phrase-singing", notes, rhythm, meter, isFragment: true, sourceLabel: label, toleranceCents: 70 },
  };
}

export const EXTRA_SOLFEGE_SONGS: ExerciseDefinition[] = [
  song(
    "ps-jingle-1",
    ["E4", "E4", "E4", "E4", "E4", "E4", "E4", "G4", "C4", "D4", "E4"],
    ["quarter", "quarter", "half", "quarter", "quarter", "half", "quarter", "quarter", "dottedQuarter", "eighth", "whole"],
    "4/4",
    "Fragment: „Jingle Bells” — piosenka świąteczna (początek refrenu)"
  ),
  song(
    "ps-jingle-2",
    ["E4", "E4", "E4", "E4", "E4", "E4"],
    ["quarter", "quarter", "half", "quarter", "quarter", "half"],
    "4/4",
    "Fragment: „Jingle Bells” — piosenka świąteczna („Jingle bells, jingle bells”)"
  ),
  song(
    "ps-oldmacdonald-1",
    ["C4", "C4", "C4", "G4", "A4", "A4", "G4", "E4", "E4", "D4", "D4", "C4"],
    ["quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "half", "quarter", "quarter", "quarter", "quarter", "whole"],
    "4/4",
    "Fragment: „Old MacDonald Had a Farm” — piosenka ludowa (refren)"
  ),
  song(
    "ps-oldmacdonald-2",
    ["C4", "C4", "C4", "G4", "A4", "A4", "G4"],
    ["quarter", "quarter", "quarter", "quarter", "quarter", "quarter", "half"],
    "4/4",
    "Fragment: „Old MacDonald Had a Farm” — piosenka ludowa (pierwsza fraza)"
  ),
  song(
    "ps-londonbridge-1",
    ["G4", "A4", "G4", "F4", "E4", "F4", "G4", "D4", "E4", "F4", "E4", "F4", "G4"],
    ["dottedQuarter", "eighth", "quarter", "quarter", "quarter", "quarter", "half", "quarter", "quarter", "half", "quarter", "quarter", "half"],
    "4/4",
    "Fragment: „London Bridge Is Falling Down” — angielska piosenka ludowa (początek)"
  ),
  song(
    "ps-londonbridge-2",
    ["G4", "A4", "G4", "F4", "E4", "F4", "G4"],
    ["dottedQuarter", "eighth", "quarter", "quarter", "quarter", "quarter", "half"],
    "4/4",
    "Fragment: „London Bridge Is Falling Down” — angielska piosenka ludowa (pierwsze dwa takty)"
  ),
  song(
    "ps-rowboat-1",
    ["C4", "C4", "C4", "D4", "E4", "E4", "D4", "E4", "F4", "G4"],
    ["dottedQuarter", "dottedQuarter", "quarter", "eighth", "dottedQuarter", "quarter", "eighth", "quarter", "eighth", "dottedHalf"],
    "6/8",
    "Fragment: „Row, Row, Row Your Boat” — kanon ludowy (pierwsze cztery takty)"
  ),
  song(
    "ps-rowboat-2",
    ["C4", "C4", "C4", "D4", "E4"],
    ["dottedQuarter", "dottedQuarter", "quarter", "eighth", "dottedQuarter"],
    "6/8",
    "Fragment: „Row, Row, Row Your Boat” — kanon ludowy („Row, row, row your boat”)"
  ),
];

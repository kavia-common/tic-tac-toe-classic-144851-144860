import React, { useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Platform,
  Animated,
} from 'react-native';

/**
 * Ocean Professional Theme
 * - primary: #2563EB (blue)
 * - secondary/success: #F59E0B (amber)
 * - error: #EF4444 (red)
 * - background: #f9fafb
 * - surface: #ffffff
 * - text: #111827
 */

type Player = 'X' | 'O';
type CellValue = Player | null;
type Board = CellValue[];

const COLORS = {
  primary: '#2563EB',
  secondary: '#F59E0B',
  success: '#F59E0B',
  error: '#EF4444',
  background: '#f9fafb',
  surface: '#ffffff',
  text: '#111827',
  muted: '#6B7280',
  shadow: Platform.OS === 'ios' ? 'rgba(0,0,0,0.12)' : '#000',
};

const initialBoard: Board = Array(9).fill(null);

function calculateWinner(board: Board): { winner: Player | 'Draw' | null; line: number[] } {
  const lines: number[][] = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // cols
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonals
    [2, 4, 6],
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }

  if (board.every((c) => c !== null)) {
    return { winner: 'Draw', line: [] };
  }

  return { winner: null, line: [] };
}

// PUBLIC_INTERFACE
export default function App() {
  /**
   * This component renders a minimalist Tic Tac Toe game with:
   * - Scoreboard for Player X and Player O
   * - Current turn indicator
   * - 3x3 game grid with rounded corners and subtle shadows
   * - Bottom controls for New Game (clear board) and Reset Scores
   * - Ocean Professional theme with blue & amber accents
   */
  const [board, setBoard] = useState<Board>(initialBoard);
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [scores, setScores] = useState<{ X: number; O: number }>({ X: 0, O: 0 });
  const [winningLine, setWinningLine] = useState<number[]>([]);
  const [statusPulse] = useState(new Animated.Value(0));

  const currentPlayer: Player = useMemo(() => (xIsNext ? 'X' : 'O'), [xIsNext]);

  const result = useMemo(() => calculateWinner(board), [board]);

  React.useEffect(() => {
    // Trigger subtle pulse on status changes
    Animated.sequence([
      Animated.timing(statusPulse, { toValue: 1, duration: 120, useNativeDriver: true }),
      Animated.timing(statusPulse, { toValue: 0, duration: 120, useNativeDriver: true }),
    ]).start();
  }, [currentPlayer, result.winner]);

  React.useEffect(() => {
    // Update score when a winner is found
    if (result.winner === 'X' || result.winner === 'O') {
      setScores((s) => ({ ...s, [result.winner as Player]: s[result.winner as Player] + 1 }));
      setWinningLine(result.line);
    } else {
      setWinningLine([]);
    }
  }, [result.winner]);

  function handlePressCell(index: number) {
    if (board[index] !== null) return; // ignore if already taken
    if (result.winner) return; // ignore after game over

    const nextBoard = board.slice();
    nextBoard[index] = currentPlayer;
    setBoard(nextBoard);
    setXIsNext((prev) => !prev);
  }

  // PUBLIC_INTERFACE
  function newGame() {
    /** Clear the board but keep the scores. */
    setBoard(initialBoard);
    setXIsNext(true);
    setWinningLine([]);
  }

  // PUBLIC_INTERFACE
  function resetScores() {
    /** Reset scores to 0 and start a new game. */
    setScores({ X: 0, O: 0 });
    newGame();
  }

  const statusText = useMemo(() => {
    if (result.winner === 'Draw') return "It's a draw!";
    if (result.winner === 'X') return 'Player X wins!';
    if (result.winner === 'O') return 'Player O wins!';
    return `Turn: Player ${currentPlayer}`;
  }, [currentPlayer, result.winner]);

  const statusColor = useMemo(() => {
    if (result.winner === 'Draw') return COLORS.muted;
    if (result.winner === 'X') return COLORS.primary;
    if (result.winner === 'O') return COLORS.secondary;
    return COLORS.text;
  }, [result.winner]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.root}>
        {/* Header / Scores */}
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={[styles.scorePill, styles.scorePillX]}>
              <Text style={styles.scorePillLabel}>Player X</Text>
              <Text style={styles.scoreValue}>{scores.X}</Text>
            </View>
            <View style={styles.vDivider} />
            <View style={[styles.scorePill, styles.scorePillO]}>
              <Text style={styles.scorePillLabel}>Player O</Text>
              <Text style={styles.scoreValue}>{scores.O}</Text>
            </View>
          </View>

          <Animated.Text
            style={[
              styles.statusText,
              { color: statusColor },
              {
                transform: [
                  {
                    scale: statusPulse.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.02],
                    }),
                  },
                ],
              },
            ]}
          >
            {statusText}
          </Animated.Text>
        </View>

        {/* Board */}
        <View style={styles.boardCard}>
          <View style={styles.board}>
            {board.map((cell, idx) => {
              const isWinning = winningLine.includes(idx);
              return (
                <Pressable
                  key={idx}
                  onPress={() => handlePressCell(idx)}
                  style={({ pressed }) => [
                    styles.cell,
                    pressed && styles.cellPressed,
                    isWinning && styles.cellWin,
                  ]}
                >
                  <Text
                    style={[
                      styles.cellText,
                      cell === 'X' && styles.cellTextX,
                      cell === 'O' && styles.cellTextO,
                      isWinning && styles.cellTextWin,
                    ]}
                  >
                    {cell ?? ''}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controlsCard}>
          <Pressable
            onPress={newGame}
            style={({ pressed }) => [styles.controlButton, styles.primaryButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.primaryButtonText}>New Game</Text>
          </Pressable>
          <Pressable
            onPress={resetScores}
            style={({ pressed }) => [styles.controlButton, styles.secondaryButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.secondaryButtonText}>Reset Scores</Text>
          </Pressable>
        </View>

        {/* Footer / Branding */}
        <Text style={styles.footerText}>Tic Tac Toe · Ocean Professional</Text>
      </View>
    </SafeAreaView>
  );
}

const CARD_RADIUS = 16;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  root: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },

  // Header / Scores
  headerCard: {
    backgroundColor: COLORS.surface,
    borderRadius: CARD_RADIUS,
    paddingVertical: 16,
    paddingHorizontal: 14,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  vDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: '#E5E7EB',
  },
  scorePill: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  scorePillX: {
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.25)',
    backgroundColor: 'rgba(37, 99, 235, 0.06)',
  },
  scorePillO: {
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
  },
  scorePillLabel: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
  },
  statusText: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },

  // Board
  boardCard: {
    backgroundColor: COLORS.surface,
    borderRadius: CARD_RADIUS,
    padding: 14,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  board: {
    aspectRatio: 1,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#EEF2FF', // very light blue base
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: '33.3333%',
    height: '33.3333%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#DBEAFE', // light blue borders
    backgroundColor: 'rgba(255,255,255,0.65)',
  },
  cellPressed: {
    backgroundColor: 'rgba(37, 99, 235, 0.06)',
  },
  cellWin: {
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
  },
  cellText: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.text,
  },
  cellTextX: {
    color: COLORS.primary,
    textShadowColor: 'rgba(37,99,235,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  cellTextO: {
    color: COLORS.secondary,
    textShadowColor: 'rgba(245,158,11,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  cellTextWin: {
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowRadius: 8,
  },

  // Controls
  controlsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: CARD_RADIUS,
    padding: 14,
    gap: 12,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  controlButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#FEF3C7', // light amber
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.45)',
  },
  secondaryButtonText: {
    color: COLORS.secondary,
    fontWeight: '700',
    fontSize: 16,
  },
  buttonPressed: {
    opacity: 0.9,
  },

  footerText: {
    textAlign: 'center',
    color: COLORS.muted,
    marginTop: 8,
    fontSize: 12,
  },
});

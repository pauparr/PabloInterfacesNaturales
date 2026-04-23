function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^\u0000-\u007f]/g, '')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function levenshteinDistance(first, second) {
  const rows = first.length + 1;
  const columns = second.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(columns).fill(0));

  for (let row = 0; row < rows; row += 1) {
    matrix[row][0] = row;
  }

  for (let column = 0; column < columns; column += 1) {
    matrix[0][column] = column;
  }

  for (let row = 1; row < rows; row += 1) {
    for (let column = 1; column < columns; column += 1) {
      const cost = first[row - 1] === second[column - 1] ? 0 : 1;
      matrix[row][column] = Math.min(
        matrix[row - 1][column] + 1,
        matrix[row][column - 1] + 1,
        matrix[row - 1][column - 1] + cost,
      );
    }
  }

  return matrix[first.length][second.length];
}

function similarityRatio(first, second) {
  const longest = Math.max(first.length, second.length);
  if (longest === 0) {
    return 1;
  }

  return 1 - levenshteinDistance(first, second) / longest;
}

function buildPatternRegex(pattern) {
  const optionalGroups = [];
  let workingPattern = normalizeText(pattern).replace(/\(([^)]+)\)/g, (_, optionalText) => {
    optionalGroups.push(normalizeText(optionalText));
    return `__OPTIONAL_${optionalGroups.length - 1}__`;
  });

  workingPattern = escapeRegex(workingPattern)
    .replace(/\\\*/g, '(.+?)')
    .replace(/\\:([a-z0-9_]+)/gi, '(.+?)')
    .replace(/\s+/g, '\\s+');

  workingPattern = workingPattern.replace(/__OPTIONAL_(\d+)__/g, (_, index) => {
    const optionalText = escapeRegex(optionalGroups[Number(index)]).replace(/\s+/g, '\\s+');
    return `(?:\\s+${optionalText})?`;
  });

  return new RegExp(`^${workingPattern}$`, 'i');
}

function runVoiceCommands(commands, spokenText, helpers = {}) {
  const normalizedSpokenText = normalizeText(spokenText);

  for (const commandDefinition of commands) {
    const commandList = Array.isArray(commandDefinition.command)
      ? commandDefinition.command
      : [commandDefinition.command];

    for (const command of commandList) {
      if (typeof command !== 'string') {
        continue;
      }

      if (commandDefinition.isFuzzyMatch) {
        const normalizedCommand = normalizeText(command);
        const ratio = similarityRatio(normalizedCommand, normalizedSpokenText);
        const threshold = commandDefinition.fuzzyMatchingThreshold ?? 0.6;

        if (ratio >= threshold) {
          commandDefinition.callback(command, spokenText, ratio, helpers);
          return true;
        }

        continue;
      }

      const commandRegex = buildPatternRegex(command);
      const match = normalizedSpokenText.match(commandRegex);

      if (match) {
        const captures = match.slice(1).map((capture) => capture.trim());

        if (captures.length > 0) {
          commandDefinition.callback(...captures, helpers);
        } else {
          commandDefinition.callback({ command, spokenPhrase: spokenText, ...helpers });
        }

        return true;
      }
    }
  }

  return false;
}

export { normalizeText, runVoiceCommands };
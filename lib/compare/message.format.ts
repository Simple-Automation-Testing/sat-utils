function rearrangeMessageKeys(notFormattedMessage: string, splitMatched?: string[]) {
  // TODO this regex should have proper description
  const rg = /(message key: .*?)(.*)(?= message:)|(message key: .*?)(.*)(?=)/gim;

  const matched = (splitMatched || notFormattedMessage.match(rg) || []).map(matchedItem => {
    const nestedMatch =
      matchedItem.trim().match(/((message key:)(.*)(?=message key:))|((message key:)(.*)(?=))/gim) || [];

    if (nestedMatch.length > 1) {
      const currentArrange = nestedMatch.map(i => i.trim()).join(' ');

      const reversedArrange = nestedMatch
        .map(i => i.trim())
        .reverse()
        .join(' ');

      notFormattedMessage = notFormattedMessage.replace(currentArrange, reversedArrange);

      return reversedArrange;
    }

    return matchedItem;
  });

  if (matched.length === 0) {
    return notFormattedMessage;
    // throw new Error(`No match found for initial message, ${notFormattedMessage}`);
  }

  const firstMatcher = matched.shift();

  return notFormattedMessage
    .split(firstMatcher)
    .filter(Boolean)
    .map((splitedItem, index) => {
      if (index === 0) {
        return `${firstMatcher} ${splitedItem}`;
      }

      return rearrangeMessageKeys(splitedItem, matched);
    })
    .join('');
}

export { rearrangeMessageKeys };

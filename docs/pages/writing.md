# Writing Style guide: READMEs, Docs, Comments, etc

[reference](https://www.gatsbyjs.com/contributing/gatsby-style-guide/)

## Word choice

### Use “you” as the pronoun

n English, your articles should use the second person (“you”) to provide a conversational tone. This way, the text and instructions seem to speak directly to the person reading it. Try to avoid using the first person (“I”, “we”, “let’s”, and “us”).

For other languages, refer to each translation’s guidelines (if applicable) for consistent phrasing. When appropriate, we suggest starting with the informal “you” to keep a conversational tone.

Using “you” in English is also more accurate than saying “we,” because typically only one person is reading the tutorial or guide at a time and the person who wrote the tutorial is not actually going through it with them, so “we” would be inaccurate. You might notice that some technical documentation uses third-person pronouns and nouns like “they” and “the user,” which add more distance and feel colder than the conversational and warm “you” and “your.”

When updating a doc to adhere to this part of the Gatsby Style Guide, one exception in English is when “we” refers to Gatsby’s core processes. The subject is the code in this case, rather than a teacher/reader connotation, and should be rewritten or restructured to not confuse the reader about what they are responsible for doing when something is happening automatically behind the scenes.

### Avoid “easy” and “simple”

Avoid using words like “easy”, “simple” and “basic” because if users have a hard time completing the task that is supposedly “easy,” they will question their abilities. Consider using more specific descriptors; for example, when you say the phrase “deployment is easy,” what do you really mean? Is it easy because it takes fewer steps than another option? If so, use the most specific descriptor possible, which in that case would be “this deployment method involves fewer steps than other options.”

For even more inclusive docs, avoid phrases that assume a reader’s experience or skill level, like “just deploy it and you’re done” or “for a refresher (referring to a completely different doc that someone may not have read)“. Often, rephrasing results in stronger sentences that appeal to a wider range of contexts.

### Avoid emojis, slang, and metaphors

Avoid using emojis or emoticons in the Docs and idiomatic expressions / slang, or metaphors. Gatsby has a global community, and the cultural meaning of an emoji, emoticon, or slang may be different around the world. Use your best judgment! Also, emojis can render differently on different systems.

## Writing style

### Use clear hyperlinks

Concise writing communicates the bare minimum without redundancy. Strive to make your writing as short as possible; this practice will often lead to more accurate and specific writing.

Hyperlinks should contain the clearest words to indicate where the link will lead you. The use of the title attribute on hyperlinks should be avoided for accessibility reasons.

```md:title=README.md
<!-- Good -->
[Gatsby Cloud](https://www.gatsbyjs.com/cloud/)

<!-- Bad -->
[here](https://www.gatsbyjs.com/cloud/ "Gatsby Cloud")
```

In tutorials that are meant for beginners, use as few hyperlinks as possible to minimize distractions. In docs, it’s ok to include as many hyperlinks as necessary to provide relevant and interesting information and resources.

### Indicate when something is optional

When a paragraph or sentence offers an optional path, the beginning of the first sentence should indicate that it’s optional. For example, “if you’d like to learn more about xyz, see our reference guide” is clearer than “Go to the reference guide if you’d like to learn more about xyz.”

This method allows people who would not like to learn more about xyz to stop reading the sentence as early as possible. This method also allows people who would like to learn more about xyz to recognize the opportunity to learn quicker instead of accidentally skipping over the paragraph.

### Abbreviate terms

If you want to abbreviate a term in your article, write it out fully first, then put the abbreviation in parentheses. After that, you may use the abbreviation going for the rest of the article. For example, “In computer science, an abstract syntax tree (AST) is …”

### Use active voice

Use active voice instead of passive voice. Generally, it’s a more concise and straightforward way to communicate a subject. For example:

- (passive) The for loop in JavaScript is used by programmers to…
- (active) Programmers use the for loop in JavaScript to…

### Prefer US English

For words that have multiple spellings, prefer the US English word over British or Canadian English. For example:

- `color` over `colour`
- `behavior` over `behaviour`
- `favorite` over `favourite`

### Use apps that help you edit

Use the [Hemingway App](https://hemingwayapp.com/). There’s nothing magical about this tool, but it will automatically detect widely agreed-upon style issues:

- passive voice
- unnecessary adverbs
- words that have more common equivalents

The Hemingway App will assign a “grade level” for your writing. You should aim for a grade level of 6. Another tool available is the De-Jargonizer, originally designed for scientific communication but might help avoid overspecialized wording.

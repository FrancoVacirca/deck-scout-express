- [x] store the filtered cards from query
- [x] use query to request to search API and store values that include the filteredCards
- [x] make so the stored cards are not getting repeated, just one time stored if the name doesn't exist
- [x] the response is only returning the cards that have stock, is this the behavior we want? maybe
- [x] create 3 endpoints to fetch card status, archidekt deck url, username, deck id from username response
- [ ] for each card on deck, query card name to pirulo endpoint and return those who have stock and how much

### API details

- variant-short-info variant-qty (span for stock in text)
- form (where all the data below is stored)
  - data-name (card name)
  - data-id (card id)
  - data-price (price)
  - data-category (card set)
  - data-variant (state of card)

_Archidekt API?_

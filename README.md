# Getting Started with The Game of Metropolitical War

## To do

- start screen
- end screen

## Notes

Hexagon side length: `34.5px` (vertical)
Maybe 30px on the horizontal
cell coord = board[col % 2 + row \* 2][col]

horizontal (coloane): 75px pentru o latura intreaga, 37.5 semilatura

vertical base 65 si 69.16

# DIRECTII

Daca e col par, scade 1 la right/left row
// uneven col
hegemons = [
{ col: 5, row: 20 }, // (col: 0, row: 0) center
{ col: 5, row: 21 }, // (col: 0, row: 1) bottom
{ col: 5, row: 19 }, // (col: 0, row: -1) up
{ col: 6, row: 20 }, // (col: 1, row: 0) right-up
{ col: 6, row: 21 }, // (col: 1, row: 1) right-bottom
{ col: 4, row: 20 }, // (col: -1, row: 0) left-up
{ col: 4, row: 21 }, // (col: -1, row: 1) left-bottom
];

// even col
hegemons = [
{ col: 12, row: 20 }, // (col: 0, row: 0) center
{ col: 12, row: 21 }, // (col: 0, row: 1) bottom
{ col: 12, row: 19 }, // (col: 0, row: -1) up
{ col: 13, row: 19 }, // (col: 1, row: -1) right-up
{ col: 13, row: 20 }, // (col: 1, row: 0) right-bottom
{ col: 11, row: 19 }, // (col: -1, row: -1) left-up
{ col: 11, row: 20 }, // (col: -1, row: 0) left-bottom
];

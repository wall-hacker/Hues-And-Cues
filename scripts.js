// Add a class to the <body> element if the page is viewed on a mobile device
function addMobileClass() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.getElementById('start-page').style.display = 'none';
        drawColorCard();
    } else {
        document.getElementById('start-page').style.display = 'block';
    }
  }

  function drawColorCard() {
      const container = document.getElementById('color-card-container');
      container.style.width = '80vw';
      container.style.height = '80vw';
      container.style.gridGap = '20vw';
      container.style.position = 'fixed'; // Use fixed positioning
      container.style.top = '50%'; // Center vertically
      container.style.left = '50%'; // Center horizontally
      container.style.transform = 'translate(-50%, -50%)'; // Adjust position
      const numRows = 2;
      const numCols = 2;

      // Create the grid container
      container.style.display = 'grid';
      container.style.gridTemplateRows = `repeat(${numRows}, 1fr)`;
      container.style.gridTemplateColumns = `repeat(${numCols}, 1fr)`;

      const coords = [];
      while (coords.length < 4) {
          let newCoord = {
              i: Math.floor(Math.random() * 14) + 2,
              j: Math.floor(Math.random() * 28) + 2
          };

          // Check if the new coordinate is already present in the array
          if (!coords.some(coord => coord.i === newCoord.i && coord.j === newCoord.j)) {
              coords.push(newCoord);
          }
      }

      // Create and append color cards
      for (let i = 0; i < numRows * numCols; i++) {
          const card = document.createElement('div');
          card.classList.add('color-card');
          //generate random number between 2 and 15
          card.style.backgroundColor = colorVector[coords[i].i * 30 + coords[i].j];
          const text = document.createElement('div');
          text.textContent = String.fromCharCode(65 + coords[i].i) + " " + (coords[i].j - 1);
          text.style.color = 'white';
          text.style.fontSize = '10vw';
          text.style.textAlign = 'center';
          text.style.top = '100%';
          text.style.position = 'relative';
          card.appendChild(text);
          container.appendChild(card);
      }
  }

  // Call the function when the page is loaded
  window.addEventListener('load', addMobileClass);

  // Track touch start position
  let touchStartX = 0;
  let touchEndX = 0;

  // Add touchstart event listener
  document.addEventListener('touchstart', function(event) {
      touchStartX = event.touches[0].clientX;
  }, false);

  // Add touchend event listener
  document.addEventListener('touchend', function(event) {
      touchEndX = event.changedTouches[0].clientX;
      handleSwipe();
  }, false);

  // Handle swipe gesture
  function handleSwipe() {
      // Calculate swipe distance
      let swipeDistance = touchEndX - touchStartX;

      // Define minimum swipe distance to trigger reload (adjust as needed)
      let minSwipeDistance = 50; // Adjust as needed

      // Check if swipe distance meets the threshold
      if (Math.abs(swipeDistance) >= minSwipeDistance) {
          // Reload the window
          window.location.reload();
      }
  }

  document.querySelector('body').addEventListener('click', function() {
    if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    }
  });

  document.getElementById('start-button1').addEventListener('click', function() {
    // Create playerCountDropdown inside the event listener function
    const playerCountDropdown = document.createElement('div');
    playerCountDropdown.innerHTML = `
        <select id="player-count" class="player-count">
          <option value="1" disabled selected hidden>Number of players</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </select>
      `;
    
    // Attach change event listener to playerCountDropdown
    playerCountDropdown.addEventListener('change', uniqueColorDropdowns);

    // Hide the start button
    const button = document.getElementById('start-button1');
    button.style.display = 'none';

    // Append playerCountDropdown to the parent element
    button.parentElement.appendChild(playerCountDropdown);
});

// Function to handle the change event of playerCountDropdown
function uniqueColorDropdowns() {
    // Retrieve the selected player count value
    const playerCountDropdown = document.getElementById('player-count');
    const playerCount = parseInt(playerCountDropdown.value);
    console.log(playerCount);
    createPlayerInputs(playerCount);
    document.getElementById('start-page').style.display = 'none';
    document.getElementById('player-selection').style.display = 'block';
    
    var selectedColor = []; // Initialize array to store selected colors
    dropdowns = Array.from(document.getElementsByClassName('color-dropdown'));
    dropdowns.forEach(dropdown => {
      let previousValue = ''; // Initialize variable to store previous selected color
      dropdown.addEventListener('change', function() {
        const value = this.value;

        // Remove the previously selected color (if it exists)
        const indexToRemove = selectedColor.indexOf(previousValue);
        if (indexToRemove !== -1) {
          selectedColor.splice(indexToRemove, 1);
        }

        // Add the new color to the selectedColor array
        if (value) {
          selectedColor.push(value);
        }

        // Update the previousValue variable with the current value
        previousValue = value;

        // Iterate over each dropdown to update the disabled options
        dropdowns.forEach(otherDropdown => {
          if (otherDropdown !== this) {
            const options = otherDropdown.options;
            for (let i = 0; i < options.length; i++) {
              if (selectedColor.includes(options[i].value)) {
                options[i].disabled = true;
              } else {
                options[i].disabled = false;
              }
            }
          }
        });
      });
    });
    
  }


  function createPlayerInputs(playerCount) {
    var container = document.getElementById('player-selection');
    container.innerHTML = '';

    for (var i = 1; i <= playerCount; i++) {
      var playerDiv = document.createElement('div');
      playerDiv.classList.add('player-input'); // Add player-input class

      var nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.id = 'player' + i + '-name';
      nameInput.placeholder = 'Player ' + i;

      var colorSelect = document.createElement('select');
      colorSelect.name = 'color' + i;
      colorSelect.classList.add('form-control', 'color-dropdown');
      colorSelect.id = 'color' + i;

      colorSelect.innerHTML = '<option value="" disabled selected hidden></option>';
      var colors = ['#0071c5', '#40E0D0', '#008000', '#FFD700', '#FF8C00', '#FF0000', '#99009e'];
      for (var j = 0; j < colors.length; j++) {
        var option = document.createElement('option');
        option.style.color = colors[j];
        option.value = colors[j];
        option.innerHTML = '&#9724;'; // Unicode character for colored square
        colorSelect.appendChild(option);
      }

      (function(colorSelect, playerId) {
        colorSelect.addEventListener('change', function() {
          colorSelect.style.color = colorSelect.value;
          players[playerId].color = colorSelect.value;
        });
      })(colorSelect, i);

      (function(nameInput, playerId) {
        nameInput.addEventListener('input', function() {
          players[playerId].name = nameInput.value;
        });
      })(nameInput, i);

      playerDiv.appendChild(nameInput);
      playerDiv.appendChild(colorSelect);

      container.appendChild(playerDiv);
    }

    var startButton = document.createElement('button');
    // startButton.classList.add('button1');
    startButton.style.top = playerCount * 3 + 'vw';
    startButton.textContent = 'START';
    container.appendChild(startButton);

    startButton.addEventListener('click', function() {
      document.getElementById('player-selection').style.display = 'none';

      gameLoop();
    });
  }

  var scoringSquare = false;
  var scoringCoords = [];
  var lock = true;
  var playerCount = 0;
  var turn = 1;
  var stage = 1;
  var colorMaster = 1;
  var players = {
    1: { name: '', color: '', score: 0, pieces: [] },
    2: { name: '', color: '', score: 0, pieces: [] },
    3: { name: '', color: '', score: 0, pieces: [] },
    4: { name: '', color: '', score: 0, pieces: [] },
    5: { name: '', color: '', score: 0, pieces: [] },
    6: { name: '', color: '', score: 0, pieces: [] }
  };

  var hoverMessage = players[turn].name + '\'s turn';

  

  const colorVector = ['#612C13', '#6D2A15', '#762317', '#871F1B', '#951F20', '#A01E23', '#AF2026', '#C92329', '#E22029', '#ED2129', '#EC2028', '#ED2129', '#EC1E31', '#EC1E3D', '#EA1C46', '#E91B56', '#E61665', '#E21175', '#D81183', '#D3188D', '#C92791', '#BC2D92', '#B33695', '#A93795', '#A13A95', '#933A96', '#8D4098', '#853F98', '#7F4198', '#75449A',
                       '#894C20', '#954521', '#9D4122', '#AE4126', '#BB3A27', '#C82E29', '#D82B29', '#E62328', '#ED2429', '#EE282D', '#EE2936', '#ED253E', '#ED2245', '#ED224F', '#ED1F61', '#ED1570', '#ED0E7E', '#E90F8E', '#DB2A92', '#CE3A95', '#C04097', '#B53E97', '#A93E97', '#9F4098', '#983F97', '#8F3F98', '#853F98', '#7F4198', '#734098', '#6A3E97',
                       '#A6632A', '#AD5C28', '#BC5C28', '#C45128', '#D04A29', '#DA432A', '#E43B28', '#EB3027', '#EE362E', '#EF3C42', '#EF3F4E', '#EF3B52', '#EF3B60', '#EE3069', '#EE2B7A', '#ED2489', '#EA3295', '#DC4699', '#CA4A9B', '#BB4D9C', '#B64A9C', '#A6499B', '#9F479A', '#954499', '#8D459A', '#843F98', '#7B3E98', '#743E98', '#673B97', '#5C3492',
                       '#CA852B', '#D9832B', '#DF772A', '#E97A26', '#E86A27', '#EC5F27', '#F2612D', '#F15832', '#F0513F', '#F15753', '#F15E67', '#F15F6C', '#F05872', '#F05380', '#EF508D', '#EF509D', '#E058A0', '#CD59A2', '#BF60A5', '#B659A2', '#A555A1', '#9C4F9E', '#954D9E', '#8E4B9D', '#83469A', '#7C449A', '#6F4099', '#683A96', '#593794', '#47308C',
                       '#E99E25', '#F39A20', '#F79420', '#F68E20', '#F68625', '#F4792F', '#F3773D', '#F36F46', '#F37052', '#F37868', '#F27677', '#F27782', '#F2778B', '#F17195', '#F06AA5', '#E772AC', '#D372AC', '#C772AE', '#BC72AF', '#AE68AA', '#A060A6', '#945AA5', '#8E56A3', '#8652A2', '#7C4A9D', '#6F489D', '#644099', '#593794', '#4B3190', '#353187',
                       '#FDB417', '#FCB123', '#FBAC2A', '#FBAC3C', '#FAA842', '#F9A44E', '#F89957', '#F6905F', '#F58966', '#F58874', '#F59084', '#F59190', '#F48F9B', '#F48EA6', '#F389B6', '#E18DBB', '#D18CBD', '#C78DBE', '#BB83B9', '#AB7BB6', '#9D76B4', '#9167AC', '#8860A9', '#7B5BA7', '#7352A2', '#644DA0', '#5A449B', '#4D3794', '#3C338F', '#2F2D78',
                       '#FEC216', '#FDC029', '#FCB72C', '#FCB53B', '#FCBA60', '#F8AD58', '#FAAC64', '#F9A46E', '#F8A479', '#F7A187', '#F7A097', '#F69F9A', '#F69FA7', '#F59BAB', '#F39EC4', '#E1A6CB', '#D3A7CC', '#CEAFD3', '#B898C7', '#A98CC1', '#9A83BD', '#8A77B6', '#806FB2', '#7566AD', '#685EAA', '#5A56A5', '#504DA0', '#46449B', '#323A95', '#2F3388',
                       '#FBD116', '#FDCF2E', '#FEC930', '#FDC841', '#FEC84C', '#FDBF5B', '#FDBC61', '#FCBA6C', '#FBB37A', '#FAB083', '#F9AF8F', '#F9B3A0', '#F5B8AE', '#F4B7B6', '#EFB6C9', '#D8B7D7', '#CEB9D9', '#CCBFDC', '#B5ABD4', '#A7A0CE', '#9894C9', '#8389C3', '#757EBD', '#6B77B9', '#5D6CB3', '#5163AE', '#475AA8', '#3F51A3', '#2F479D', '#243F98',
                       '#F8E515', '#FADE26', '#FBDA36', '#FBDA43', '#FBE14C', '#FED95B', '#FCDC63', '#FAD76A', '#F5DE7C', '#F1E393', '#ECE09F', '#E8E4B5', '#E1E1C4', '#DCE4CC', '#D3E3D4', '#C6E1E8', '#C2DAF2', '#C2DAF1', '#A7C8E9', '#9ABAE0', '#8AABDA', '#7BA1D5', '#7193CC', '#6787C5', '#567ABC', '#4E6DB4', '#4263AE', '#3C5DA9', '#3551A3', '#2A4A9E',
                       '#F5ED26', '#F5ED2B', '#F7ED36', '#F4EE4C', '#F5EF52', '#F4EF62', '#F4EF6E', '#EDEE85', '#E7EB8F', '#DFE99E', '#D8E8AD', '#D5E9C0', '#D3E8CC', '#CDE7D1', '#C9E7D8', '#BCE4E3', '#B4E3F3', '#B4E2F7', '#A0DDF5', '#89D6F5', '#7EC8EF', '#74B5E4', '#66A9DB', '#5D98D1', '#4F8CCA', '#4E7DBF', '#3F70B7', '#3567B1', '#385DAA', '#3053A3',
                       '#F1EC44', '#F2ED46', '#F1ED4C', '#F1EC53', '#F0EC5B', '#EAEA6B', '#E6EA7E', '#E0E886', '#D7E485', '#C9E08E', '#BFDD98', '#B5DAA4', '#B5DBAF', '#B1DBB5', '#AFDBC1', '#AFDED8', '#ABDEDF', '#A9DDE1', '#99D9E8', '#8BD6EF', '#74D1F6', '#66CCF4', '#60BDEB', '#5AABDD', '#569ED5', '#488AC9', '#3D7EC1', '#3D71B7', '#3566B0', '#355EAB',
                       '#EFEA28', '#ECE930', '#E9E835', '#E8E840', '#E6E749', '#DCE455', '#CFE063', '#C0DA6A', '#B1D56F', '#A9D378', '#9FD080', '#99CF8A', '#93CF9A', '#8DCD9C', '#90CFA8', '#8ED0B3', '#90D2BF', '#8CD1C8', '#84CFCB', '#7ACED4', '#6ACBD9', '#57C8DF', '#3DC7F0', '#39BDED', '#3DA9DF', '#389AD4', '#4289C8', '#347BBD', '#3D71B7', '#3566B1',
                       '#E1E425', '#DCE22C', '#D7E037', '#CEDD3A', '#C8DB45', '#BAD647', '#AFD34E', '#A0CE53', '#91C959', '#87C762', '#7AC46B', '#72C272', '#70C27C', '#6DC284', '#6FC48C', '#71C594', '#71C69E', '#74C8A8', '#76C8AC', '#6BC7B5', '#62C5BB', '#56C4C5', '#49C3D0', '#37C2DB', '#1EBDE8', '#22AAE1', '#279CD7', '#388DCB', '#2D80C3', '#2373B7', 
                       '#C4D931', '#BCD631', '#B4D336', '#ABCF3B', '#9FCC3B', '#95C941', '#81C343', '#78C145', '#70BE47', '#5CB647', '#53B64A', '#4BB455', '#45B859', '#46B86A', '#50BB74', '#59BD7B', '#5ABE7F', '#5FBF8A', '#60C08B', '#61C193', '#5CC19F', '#55C1AB', '#43C0B3', '#35BFC3', '#2CC0CE', '#1FBCDB', '#13AEDF', '#1DA6DE', '#2496D2', '#2D86C6',
                       '#9FC63B', '#9AC63E', '#95C43E', '#88C141', '#81BE42', '#6CB545', '#62B246', '#54AA47', '#50A747', '#40A048', '#35A048', '#2EA64A', '#29AC4B', '#32B34C', '#35B555', '#39B65F', '#42B865', '#44B96F', '#46BA71', '#51BC77', '#54BD86', '#48BD90', '#41BE9F', '#36BDA8', '#26BEB8', '#2EBFC5', '#24BFD2', '#14B5D5', '#16A9DD', '#1EA0DA',
                       '#7CA741', '#77AC43', '#70AA45', '#67A544', '#58A646', '#4CA247', '#449A46', '#399947', '#279447', '#1D8B45', '#198D45', '#169347', '#189C49', '#1CA44A', '#22AD4B', '#2CB34D', '#33B44D', '#36B556', '#3AB65F', '#3EB666', '#3EB971', '#38B97D', '#31B98A', '#23BA98', '#1ABAA0', '#15BBAC', '#1DBCBD', '#1EBDC8', '#17B9D9', '#17B3E5'];
  const grayVector1 = ['#424342', '#444645', '#484848', '#494B4A', '#4B4E4D', '#4F4F4F', '#4F5050', '#535655', '#565857', '#575858', '#5A5D5D', '#5E5E5F', '#5F6160', '#626564', '#656565'];
  const grayVector2 = ['#8F8F8F', '#898B8A', '#868988', '#858886', '#828483', '#808382', '#7D7F7F', '#7A7B7B', '#797878', '#747675', '#727473', '#717171', '#6B6E6C', '#6B6B6B', '#696966'];
  const grayVector3 = ['#90908F', '#949393', '#949592', '#969696', '#989996', '#9B9C9B', '#9C9C9C', '#9EA0A0', '#A2A2A0', '#A4A4A4', '#A7A7A4', '#A8ACAA', '#ADADAD', '#AFB0B0', '#B2B4B3'];

  function checkGameEnd() {
    for (i = 1; i < 7; i++)
      if(players[i].score >= 45)
        return i;
    return 0;
  }

  function createGameBoard(rows, cols) {
      const board = document.getElementById('board');

      const playerCountDropdown = document.getElementById('player-count');
      const playerCount = parseInt(playerCountDropdown.value);
      for (let i = 1; i <= playerCount; i++) {
        for (let j = 1; j <= 3; j++) {
          // Create a triangle element
          const triangle = document.createElement('div');
          triangle.classList.add('triangle');
          const triangleColor = document.createElement('div');
          triangleColor.classList.add('triangleColor');

          // Assign player color to the triangle
          // triangleColor.style.borderBottomColor = players[i].color;
          triangleColor.style.background = players[i].color;
          triangle.appendChild(triangleColor);
          // triangle.style.display = 'none';
          players[i].pieces[j] = ({triangle: triangle, row: -1, col: -1});
        }
      }

      for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
              if(j < 30) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.style.backgroundColor = colorVector[i*30 + j];
                if (i === 0) {
                    const number = document.createElement('div');
                    number.classList.add('number1');
                    number.textContent = j + 1;
                    square.appendChild(number);
                }
                if (i === rows - 1) {
                    const number = document.createElement('div');
                    number.classList.add('number2');
                    number.textContent = j + 1;
                    square.appendChild(number);
                }
                if (j === 0) {
                    const letter = document.createElement('div');
                    letter.classList.add('letter1');
                    letter.textContent = String.fromCharCode(65 + i);
                    square.appendChild(letter);
                }
                if (j === 30 - 1) {
                    const letter = document.createElement('div');
                    letter.classList.add('letter2');
                    letter.textContent = String.fromCharCode(65 + i);
                    square.appendChild(letter);
                }
                
                // Add event listener to each square
                square.addEventListener('click', function() {
                  if (!enableClick)
                    return;

                      if (scoringSquare) {
                        
                        square.appendChild(shape);
                        const shapeWidth = shape.offsetWidth;
                        const shapeHeight = shape.offsetHeight;
                        shape.style.top = square.offsetTop + (square.offsetHeight - shapeHeight) / 2.9 + 'px';
                        shape.style.left = square.offsetLeft + (square.offsetWidth - shapeWidth) / 2.95 + 'px';
                        document.removeEventListener('mousemove', updateShapePosition);
                        scoringCoords = {row: i + 1, col: j + 1};

                      } else {
                        square.appendChild(players[turn].pieces[stage].triangle);
                        // Store piece information for the player
                        players[turn].pieces[stage].row = i + 1;
                        players[turn].pieces[stage].col = j + 1;
                      }
                });

                board.appendChild(square);
                
              } else {
                if (j != 30 && j != 31 && i != 0) {
                  const square = document.createElement('div');
                  square.classList.add('square');
                  if (j == 32)
                    square.style.backgroundColor = grayVector1[i - 1];
                  if (j == 33)
                    square.style.backgroundColor = grayVector2[i - 1];
                  if (j == 34)
                    square.style.backgroundColor = grayVector3[i - 1];
                  
                  board.appendChild(square);
                } else {
                  if (i == 0 && j == 34) {
                    const circle = document.createElement('div');
                    circle.classList.add('circle');
                    const info = document.createElement('div');
                    info.classList.add('info');
                    info.textContent = '\u2139';
                    //circle.title = players[turn].name + '\'s';
                    circle.appendChild(info);
                    board.appendChild(circle);
                  } else {
                    if (i == 0 && j == 32) {
                      const rectangle = document.createElement('div');
                      rectangle.classList.add('rectangle');
                      const info = document.createElement('div');
                      info.classList.add('info');
                      info.textContent = 'NEXT TURN';
                      info.style.fontSize = '1vw';
                      
                      rectangle.addEventListener('click', function() {
                        turn++;
                        unlockFunction();
                      });

                      rectangle.appendChild(info);
                      board.appendChild(rectangle);
                    } else {
                      const square = document.createElement('div');
                      board.appendChild(square);
                    }
                  }
                }
                
              }
          }
      }
  }

  async function gameLoop() {
    // Create a game board
    createGameBoard(16, 35);

    const playerCountDropdown = document.getElementById('player-count');
    const playerCount = parseInt(playerCountDropdown.value);
    console.log(playerCount);
    
    while(checkGameEnd() == 0) {
      
      for (stage = 1; stage < 3; stage++) {
        turn = 1;
        scoringSquare = false;
        while (turn < playerCount + 1) {
            var circle = document.getElementsByClassName('circle')[0];
            circle.title = players[turn].name + "'s turn";
            if (turn == colorMaster) {
              if (stage == 1)
                showCard(`${players[colorMaster].name}<br> is choosing<br> a color`, 5000);
              if (stage == 2)
                showCard(`${players[colorMaster].name}<br> is giving<br> a hint`, 5000);
              enableClick = false;

            } else {
              showCard(`${players[turn].name}'s turn`, 5000);
              enableClick = true;

            }
            
            await lockFunction();
        }
      }

      showCard(`${players[colorMaster].name}<br> is revealing<br> the color`, 5000);
      enableClick = true;
      scoringSquare = true;
      document.addEventListener('mousemove', updateShapePosition);
      
      await lockFunction();
      shape.style.display = 'none';

      //calculate the score
      for (let i = 2; i < playerCount + 1; i++) {
        for (let j = 1; j <= 2; j++) {
          let target_i = scoringCoords.row;
          let target_j = scoringCoords.col;
          let player_i = players[i].pieces[j].row;
          let player_j = players[i].pieces[j].col;

          if (target_i == player_i && target_j == player_j) {
            players[i].score+=3;
            players[colorMaster].score++;
          } else if (Math.abs(target_i - player_i) <= 1 && Math.abs(target_j - player_j) <= 1) {
            players[i].score+=2;
            players[colorMaster].score++;
          } else if (Math.abs(target_i - player_i) <= 2 && Math.abs(target_j - player_j) <= 2) {
            players[i].score++;
          }
        }
      }

      for (let i = 1; i < playerCount + 1; i++) {
        console.log(players[i].name + " score: " + players[i].score);
      }

      //clear all square children from the triangle class
      var squares = document.getElementsByClassName('square');
      for (let i = 0; i < squares.length; i++) {
          for (let j = 0; j < squares[i].children.length; j++) {
              if (squares[i].children[j].classList.contains('triangle')) {
                  squares[i].removeChild(squares[i].children[j]);
              }
          }
      }
      movePiece();


      //left shift players to make the next player the color master
      var temp = players[1];
      for (var i = 1; i < playerCount; i++) {
        players[i] = players[i + 1];
      }
      players[playerCount] = temp;
    }

    game.style.display = 'none';
    createConfetti();
  }

  function delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function lockFunction() {
    while (lock) {
      await delay(10); // Adjust the delay as needed
    }
    lock = true;
  }

  function unlockFunction() {
    lock = false;
  }

  function showCard(placeHolder, duration) {
      // Create the card element
      var card = document.createElement('div');
      card.classList.add('card');

      // Style the card
      card.style.position = 'fixed';
      card.style.top = '22.65vw';
      card.style.left = '42.85vw';
      card.style.transform = 'translate(-50%, -50%)';
      card.style.background = 'rgba(0, 0, 0, 0.8)'; // Dark mode background
      card.style.padding = '15vw 26.5vw';
      card.style.borderRadius = '3vw';
      card.style.color = 'white';
      card.style.overflow = 'hidden'; // Hide overflow content

      // Create and style the placeholder message
      var message = document.createElement('p');
      message.innerHTML = placeHolder;
      message.style.font = 'Impact, sans-serif';
      message.style.fontSize = '5vw';
      message.style.textAlign = 'center';
      message.style.display = 'flex'; // Use flexbox layout
      message.style.justifyContent = 'center'; // Horizontally center the content
      message.style.alignItems = 'center'; // Vertically center the content
      message.style.height = '100%'; // Ensure the height of the container is 100%
      message.style.margin = '0'; // Remove any margin
      message.style.padding = '0'; // Remove any padding
      message.style.overflow = 'hidden'; // Hide overflow text
      message.style.whiteSpace = 'nowrap';

      var obj = document.createElement('div');
      obj.style.position = 'fixed';
      obj.style.top = '22.65vw';
      obj.style.left = '42.85vw';
      obj.style.transform = 'translate(-50%, -50%)';
      obj.style.background = 'rgba(0, 0, 0, 0)';
      obj.style.color = 'white';

      document.body.appendChild(card);
      obj.appendChild(message);
      document.body.appendChild(obj);
      

      // Automatically remove the card after the specified duration
      setTimeout(function() {
          card.remove();
          obj.remove();
      }, duration);
  }

  // Get the shape element
  const shape = document.getElementById('shape');

  // Function to update the position of the shape based on mouse movement
  function updateShapePosition(event) {
      // Get the current mouse coordinates
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      // Calculate the left and top positions to center the shape around the mouse
      const shapeWidth = parseFloat(window.getComputedStyle(shape).width); // Get shape width
      const shapeHeight = parseFloat(window.getComputedStyle(shape).height); // Get shape height
      const offsetX = (shapeWidth / 2); // Offset to center horizontally
      const offsetY = (shapeHeight / 2); // Offset to center vertically
      const leftPosition = mouseX - offsetX + 'px'; // Calculate left position
      const topPosition = mouseY - offsetY + 'px'; // Calculate top position

      // Set the position of the shape
      shape.style.display = 'block';
      shape.style.left = leftPosition;
      shape.style.top = topPosition;
  }

  function createConfetti() {
      
      const confettiCount = 100; // Number of confetti pieces

      const name = checkGameEnd();
      const originalColor = players[name].color;
      const lighterColor = adjustColor(originalColor, 0.8); // Adjust the color to be lighter
      const darkerColor = adjustColor(originalColor, -0.8); // Adjust the color to be darker
      const colors = [originalColor, lighterColor, darkerColor]; // Example colors

      const message = document.createElement('p');
      message.innerHTML = `${players[name].name}<br>has won!`;
      message.style.font = 'Impact, sans-serif';
      message.style.fontSize = '5vw';
      message.style.textAlign = 'center';
      message.style.position = 'absolute';
      message.style.top = '40%';
      message.style.left = '50%';
      message.style.transform = 'translate(-50%, -50%)';
      message.style.zIndex = '101'; // Ensure the message is on top
      message.style.color = 'white';
      document.body.appendChild(message);

      for (let i = 0; i < confettiCount; i++) {
          const confetti = document.createElement('div');
          confetti.classList.add('confetti');
          confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          confetti.style.left = Math.random() * window.innerWidth + 'px';
          confetti.style.animationDuration = (Math.random() * 3 + 1) + 's'; // Random duration between 1 to 4 seconds
          confetti.style.animationDelay = Math.random() * 2 + 's'; // Random delay up to 2 seconds
          confetti.style.zIndex = '100'; // Ensure the confetti is behind the message
          document.body.appendChild(confetti);
      }
  }

  // Function to lighten or darken a color
  function adjustColor(color, percent) {
      // Parse the color string into RGB components
      const r = parseInt(color.substring(1, 3), 16);
      const g = parseInt(color.substring(3, 5), 16);
      const b = parseInt(color.substring(5, 7), 16);

      // Adjust each RGB component by the given percentage
      const adjustedR = Math.round(r * (1 + percent));
      const adjustedG = Math.round(g * (1 + percent));
      const adjustedB = Math.round(b * (1 + percent));

      // Ensure the adjusted values are within the valid range (0-255)
      const finalR = Math.min(255, Math.max(0, adjustedR));
      const finalG = Math.min(255, Math.max(0, adjustedG));
      const finalB = Math.min(255, Math.max(0, adjustedB));

      // Convert the adjusted RGB components back to a hex color string
      return '#' + (finalR * 65536 + finalG * 256 + finalB).toString(16).padStart(6, '0');
  }


  async function movePiece() {
      const board = document.getElementById('board');
      const playerCountDropdown = document.getElementById('player-count');
      const playerCount = parseInt(playerCountDropdown.value);
      let colors = [];

      for (let i = 1; i <= playerCount; i++) {
        let cell = 0;
        if (players[i].score <= 15)
          cell = board.children[`${players[i].score * 35 + 32}`];
        if (players[i].score > 15 && players[i].score <= 30)
          cell = board.children[`${(31 - players[i].score) * 35 + 33}`];
        if (players[i].score > 30 && players[i].score <= 45)
          cell = board.children[`${(players[i].score - 30) * 35 + 34}`];
        const triangle = players[i].pieces[3].triangle;
        
        // Append the triangle to the cell
        if (players[i].score <= 45 && players[i].score >= 1) {
          cell.appendChild(triangle);
        }
          
      }

      //clear all square children from the triangle class
      var squares = document.getElementsByClassName('square');
      for (let i = 0; i < squares.length; i++) {
          for (let j = 0; j < squares[i].children.length; j++) {
              if (squares[i].children[j].id.includes('triangleSplit')) {
                  squares[i].removeChild(squares[i].children[j]);
              }
          }
      }

      for (let i = 1; i <= 45; i++) {
        let cell = 0;
        if (i <= 15)
          cell = board.children[`${i * 35 + 32}`];
        if (i > 15 && i <= 30)
          cell = board.children[`${(31 - i) * 35 + 33}`];
        if (i > 30 && i <= 45)
          cell = board.children[`${(i - 30) * 35 + 34}`];
        let colors = [];
        for (let j = 1; j <= playerCount; j++) {
          if (players[j].score == i) {
            colors.push(players[j].color);
          }
        }
        if (cell.children.length > 1) {
          const triangle = document.createElement('div');
          triangle.id = 'triangleSplit';
          triangle.classList.add('triangleColor');
          triangle.style.background = generateGradient(colors);
          triangle.style.clipPath = 'polygon(0% 100%, 50% 0%, 100% 100%)';
          triangle.style.transform = 'translateX(6%) translateY(9%) scale(0.8)';
          cell.appendChild(triangle);
        }
        
      }
  }

  function generateGradient(colors) {
      // Calculate the percentage width for each color slice
      const sliceWidth = 100 / colors.length;

      // Generate color stops for the gradient
      const colorStops = colors.map((color, index) => {
          const position = index * sliceWidth;
          return `${color} ${position}% ${position + sliceWidth}%`;
      });

      // Combine color stops into a gradient string
      const gradient = `-webkit-linear-gradient(-180deg, ${colorStops.join(', ')})`;
      console.log(gradient);
      return gradient;
  }
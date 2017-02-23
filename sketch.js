var gridSize    = 25;
var mySnake     = new Snake();
var foodArray   = new FoodArray();
var actualMotion;
var timeStart;
var timeEnd;
var timeDiff        = 0;
var actualPoints    = 0;
var isPaused        = false;
var isEnd           = false;
var didMove         = true;
var speedMillis     = 200;

function setup()
{
    frameRate(60);
    var canvas = createCanvas(500,500);

    canvas.parent('container');

    mySnake.addPart(0, 0);
    foodArray.checkFood();

    timeStart = timestamp();
}

function draw()
{
    if (isEnd) { noLoop(); }

    background(67, 73, 103);
    mySnake.drawParts();
    foodArray.drawFood();

    timeEnd     = timestamp();
    timeDiff    = timeEnd - timeStart;

    if (timeDiff > (speedMillis))
    {
        mySnake.moveSnake();
        foodArray.eatFood();
        didMove = true;

        if (foodArray.foodStorage.length < 1)
        {
            foodArray.checkFood();
        }

        if (mySnake.checkEnd() == true)
        {
            isEnd = true;
            mySnake.drawParts();
        }

        timeStart = timeEnd;
    }
}

function Snake()
{
    this.parts = [];
    this.partStorage = 0;

    this.motionVector = new function()
    {
        this.x = 0;
        this.y = 0;
    }

    this.addPart = function(x, y)
    {
        this.parts.push(new SnakePart(x, y));
    }

    this.drawParts = function()
    {
        for(var i in this.parts)
        {
            if (i == 0 || isEnd)
            {
                fill(222, 49, 99);
            }
            else
            {
                fill(240);
            }

            var p = this.parts[i];
            rect(p.x, p.y, gridSize, gridSize);
        }
    }

    this.moveSnake = function()
    {
        var lastPartX = this.parts[this.parts.length-1].x;
        var lastPartY = this.parts[this.parts.length-1].y;

        calcPartMotionVector();
        for(var i in this.parts)
        {
            var p = this.parts[i];

            p.x += p.motionVector.x * gridSize;
            p.y += p.motionVector.y * gridSize;
        }

        if (this.partStorage > 0)
        {
            this.addPart(lastPartX, lastPartY);
            this.partStorage -= 1;
        }
    }

    this.checkEnd = function()
    {
        var snakeHead = this.parts[0];
        if (snakeHead.x < 0 || snakeHead.x > width ||
            snakeHead.y < 0 || snakeHead.y > height)
        {
            return true;
        }
        for (var i = this.parts.length-1; i>0; i--)
        {
            var snakeTail = this.parts[i];
            if (snakeTail.x == snakeHead.x && snakeTail.y == snakeHead.y)
            {
                return true;
            }
        }
        return false;
    }
}

function SnakePart(x, y)
{
    this.x = x - (x%gridSize);
    this.y = y - (y%gridSize);

    this.motionVector = new function()
    {
        this.x = 0;
        this.y = 0;
    }
}

function FoodArray()
{
    this.FOOD_COUNT = 5;
    this.foodStorage = [];

    this.checkFood = function()
    {
        if (this.foodStorage.length < this.FOOD_COUNT) // wenn zu wenig Essen vorhanden ist
        {
            while(this.foodStorage.length < this.FOOD_COUNT) // generiere Essen so lange zu wenig vorhanden ist
            {
                while(true)
                {
                    var f = new Food(random(width), random(height));

                    if(!this.isFoodOnSnake(f) && !this.isFoodOnFood(f))
                    {
                        this.foodStorage.push(f);
                        break;
                    }
                }
            }
        }
    }

    this.isFoodOnSnake = function(food)
    {
        for(var i=0; i<mySnake.parts.length; i++)
        {
            if(mySnake.parts[i].x == food.x && mySnake.parts[i].y == food.y)
            {
                return true;
            }
        }
        return false;
    }

    this.isFoodOnFood = function(food)
    {
        for (var i = 0; i < this.foodStorage.length; i++)
        {
            if( this.foodStorage[i].x == food.x &&
                this.foodStorage[i].y == food.y)
            {
                return true;
            }
        }

        return false;
    }

    this.eatFood = function()
    {
        var eatenFood = [];

        for (var i = 0; i < this.foodStorage.length; i++)
        {
            var food = this.foodStorage[i];
            var snakeHead = mySnake.parts[0];

            if (snakeHead.x == food.x && snakeHead.y == food.y)
            {
                mySnake.partStorage++;
                actualPoints++;
                eatenFood.push(i);
            }
        }

        for (var i = 0; i < eatenFood.length; i++)
        {
            this.foodStorage.splice(eatenFood[i], 1);
        }

        $('#points').html('points: ' + actualPoints);
    }

    this.drawFood = function()
    {
        fill(255, 204, 0);
        for (var i = 0; i < this.foodStorage.length; i++)
        {
            var food = this.foodStorage[i];
            rect(food.x, food.y, gridSize, gridSize);
        }
    }
}

function Food(x, y)
{
    this.x = x - (x%gridSize);
    this.y = y - (y%gridSize);
}

function keyPressed()
{
    if (keyCode == UP_ARROW)
    {
        console.log('up');
        calcMotionVector('up')
    }
    else if (keyCode == RIGHT_ARROW)
    {
        console.log('right');
        calcMotionVector('right')
    }
    else if (keyCode == DOWN_ARROW)
    {
        console.log('down');
        calcMotionVector('down')
    }
    else if (keyCode == LEFT_ARROW)
    {
        console.log('left');
        calcMotionVector('left')
    }
    else if (keyCode == 32) // space pressed
    {
        console.log('space');
        // mySnake.partStorage += 1;

        if (isPaused)
        {
            loop();
            isPaused = false;
        }
        else
        {
            noLoop();
            isPaused = true;
        }
    }
    else if (keyCode == 82) // 'R' pressed
    {
        console.log('r');

        mySnake = new Snake();
        mySnake.addPart(0, 0);

        foodArray = new FoodArray();
        foodArray.checkFood();

        timeDiff        = 0;
        actualPoints    = 0;
        isPaused        = false;
        isEnd           = false;
        actualMotion    = '';

        timeStart = timestamp();
        loop();
    }
    else if (keyCode == 83) // 'S' pressed
    {
        speedMillis = 100;
    }
    return false;
}

function keyReleased()
{
    if (keyCode == 83) // 'S' released
    {
        speedMillis = 200;
    }
    return false;
}

function calcMotionVector(motion)
{
    if (motion == actualMotion) { return; }

    if (didMove)    // prevent glitches from fast key pressing (wait til the next move of the snake)
    {
        if (motion == 'up')
        {
            if (actualMotion == 'down') { return; }

            mySnake.motionVector.y = -1;
            mySnake.motionVector.x = 0;
            actualMotion = 'up';
        }
        else if (motion == 'right')
        {
            if (actualMotion == 'left') { return; }

            mySnake.motionVector.y = 0;
            mySnake.motionVector.x = 1;
            actualMotion = 'right';
        }
        else if (motion == 'down')
        {
            if (actualMotion == 'up') { return; }

            mySnake.motionVector.y = 1;
            mySnake.motionVector.x = 0;
            actualMotion = 'down';
        }
        else if (motion == 'left')
        {
            if (actualMotion == 'right') { return; }

            mySnake.motionVector.y = 0;
            mySnake.motionVector.x = -1;
            actualMotion = 'left';
        }

        didMove = false;
    }
}

function calcPartMotionVector()
{
    for (var i = mySnake.parts.length-1; i>=0; i--)
    {
        if (i > 0)
        {
            var child = mySnake.parts[i];
            var parent = mySnake.parts[i-1];

            child.motionVector.x = parent.motionVector.x;
            child.motionVector.y = parent.motionVector.y;
        }
        else
        {
            // i should be = 0
            mySnake.parts[i].motionVector.x = mySnake.motionVector.x;
            mySnake.parts[i].motionVector.y = mySnake.motionVector.y;
        }
    }
}

function timestamp()
{
    return Date.now();
}

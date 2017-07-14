function main()
    grid = {}
    for i = 1,32 do
        grid[i] = {}
        for j = 1, 32 do
            local x = i - 16
            local y = j - 16
            local theta = math.atan2(x, y)
            local distance = math.sqrt(x^2 + y^2)
            local bool = math.floor(distance / 4 + theta/math.pi) % 2 == 0
            grid[i][j] = bool and 1 or 0
        end
    end
    print(braillify(grid, 32, 32))
end




function braillify(grid, width, height)
    if width % 2 ~= 0 or height % 4 ~= 0 then
        error("Bad width/height")
    end
    local translate = {{1,2,4,64},{8,16,32,128}}
    local gsmall = {}
    for i = 1, width/2 do
        gsmall[i] = {}
        for j = 1, height/4 do
            gsmall[i][j] = 0
        end
    end

    for x = 1, width do
        for y = 1, height do
            local xsmall = (x-1)//2 + 1
            local ysmall = (y-1)//4 + 1
            local tx = ((x-1) % 2) + 1
            local ty = ((y-1) % 4) + 1
            gsmall[xsmall][ysmall] = gsmall[xsmall][ysmall] + grid[x][y] * translate[tx][ty]
        end
    end

    local output = ""
    for y = 1, height/4 do
        for x = 1, width/2 do
            output = output .. utf8.char(0x2800 + gsmall[x][y])
        end
        output = output .. "\n"
    end
    return output
end

main()

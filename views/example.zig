export fn sumArray(array: []u32) -> u32 {
    var sum: u32 = 0;
    for (array) |item| {
        sum += item;
    }
    sum
}

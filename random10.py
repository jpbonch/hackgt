import pandas as pd
import random
import time

t1 = time.time()

movies500 = pd.read_csv("movies500.csv")

moviesArray = []

for i in range(0, 10):
    r = random.randint(0,500)
    moviesArray.append(movies500.iloc[r])

for i in moviesArray:
    print(i)

t2 = time.time()

time = t2-t1
print(time)
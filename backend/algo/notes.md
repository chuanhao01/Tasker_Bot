# Basic Problem Statement

Problem  
A project has a few tasks, and each task has deadlines, how should we schedule the tasks such that the total lateness is reduced?  

Note:  
Lateness is defined as how long after the deadline did you take to finish the task.   
Lateness is also defined in Hours (Number of hours past the deadline, rounded to 3dp)  

## Thoughts
Given 2 tasks with the same deadline, does it matter which order in which they are scheduled.  
```
Start time: 00 00

Tasks:
[
    {
        'dueTime': 02 00,
        'duration' : 2
    },
    {
        'dueTime': 02 00,
        'duration' : 5
    }
]

2 + 5 -> 07 (5h) -> (5h)
5 + 2 -> 07 (3h + 5h) -> (8h)

1, x
x-1 deadline
1, x -> 2h
x, 1 -> 1 + 2 -> 3h
(Smallest example)
```

So it is always better to arrange tasks with the same deadline in ascending order, finishing the closest task first, because they will 'accumulate' lateness.  

Now given 2 tasks with different deadlines, is it always better to finish the tasks with the earlier deadline first?  
Yes, because of 'accumulating' lateness said above.  

As such the algorithm would be to, sort the tasks by ascending deadlines, then sort the tasks by duration given the same deadline.
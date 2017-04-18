#! /bin/env python
import subprocess, ConfigParser
import Queue
from threading import Thread, Lock

from functools import partial
from tornado.ioloop import IOLoop

from hite.mes.comm.utils import *

def start_thread(tFunc, args, bDaemon=True):
    t = Thread(target=tFunc, args=args)
    t.setDaemon(bDaemon)
    t.start()
    return t

def start_process(aCmd, pCWD = None):
    if isinstance(aCmd, str): bShell = 1
    else: bShell = 0
    f = os.tmpfile()
    p = subprocess.Popen(aCmd, shell=bShell, cwd=pCWD, stdout=f, stderr=f)
    return p, f

def system(*aCmd):
    p = subprocess.Popen(aCmd, stdout=subprocess.PIPE)
    p.wait()
    return p.communicate()[0]

class ThreadWord(Thread):
    def __init__(self, queue):
        Thread.__init__(self)
        self.queue = queue

    def run(self):
        while True:
            try:
                args, callback = self.queue.get()
            except Queue.Empty: continue

            IOLoop.instance().add_callback(partial(callback, args))
            self.queue.task_done()


class Worker(Thread):
    """Thread executing tasks from a given tasks queue"""
    def __init__(self, tasks):
        Thread.__init__(self)
        self.tasks = tasks
        self.daemon = True
        self.start()

    def run(self):
        while True:
            func, args, kargs = self.tasks.get()
            try: func(*args, **kargs)
            except Exception, e: print e
            self.tasks.task_done()

class ThreadPool(Queue.Queue):
    """Pool of threads consuming tasks from a queue"""
    def __init__(self, num_threads):
        Queue.Queue.__init__(self, num_threads)
        for _ in range(num_threads): Worker(self)

    def submit(self, func, *args, **kargs):
        """Add a task to the queue"""
        self.put((func, args, kargs))

class MyConfigParser(ConfigParser.RawConfigParser):
    def optionxform(self, optionstr):
        return optionstr

if __name__ == '__main__':
    from random import randrange
    delays = [randrange(1, 10) for i in range(100)]

    from time import sleep
    def wait_delay(d):
        print 'sleeping for (%d)sec' % d
        sleep(d)

    # 1) Init a Thread pool with the desired number of threads
    pool = ThreadPool(20)

    for i, d in enumerate(delays):
        # print the percentage of tasks placed in the queue
        print '%.2f%c' % ((float(i)/float(len(delays)))*100.0,'%')

        # 2) Add the task to the queue
        pool.submit(wait_delay, d)

    # 3) Wait for completion
    pool.join()

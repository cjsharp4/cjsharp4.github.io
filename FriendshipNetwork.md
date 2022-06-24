-- Code for this project can be viewed at: https://github.com/cjsharp4/TwitterFriendshipAnalysis --

Social Media Data Analysis

For my project, I used the Tweepy library to utilize Twitter’s API. I scraped data from my personal Twitter account to get my follower and friend relationships, along with their relationship to each other. Twitter’s limited data rates allowed for only 150 friendship comparisons every 15 minutes. In order to get every friend relationship, I needed to sleep my python script after 150 API calls for 15 minutes. This made the data scraping process take about 12 hours after optimizing the methods used to lower the amount of API calls made.

After saving my data in JSON format, I used the networkx and matplotlib python libraries to graph my data. I started by creating a directed graph to represent my friendship network. Each user is a node in the graph and each directed edge shows if a user is following another user. For example, I (_carsonsharp) am following Nike, so there is an edge from my node that points to Nike’s node. Nike does not have an arrow pointing to my node since Nike does not follow me:
![image](https://user-images.githubusercontent.com/65328908/175658757-73c6a31d-e6dd-420a-a8c1-ab6f256c7415.png)

Here is a more zoomed in photo:

![image](https://user-images.githubusercontent.com/65328908/175658790-bf33b0ae-a664-412c-bf32-e0872bb4318f.png)

With 100 users in the network, it is hard to see all the nodes and the direction of each edge. When running the code, it is possible to zoom in and see all nodes and arrows on the graph.

The clustering coefficient, PageRank distribution and in and out degree distribution were also calculated.

The main user’s (_carsonsharp) clustering coefficient was calculated at: 0.2020436985959957. The average clustering coefficient among all nodes was: 0.5131879410570096. The clustering coefficient was also calculated for every node in the graph:

![image](https://user-images.githubusercontent.com/65328908/175658820-441ce237-c025-418c-a7e4-6a4301a54507.png)

![image](https://user-images.githubusercontent.com/65328908/175658939-02f02698-8ac8-43a2-a9af-78b515cf1968.png)

![image](https://user-images.githubusercontent.com/65328908/175658961-0e0ebc86-034a-4d46-bf99-f8e5a3eba030.png)


References:

https://docs.tweepy.org/en/stable/

https://matplotlib.org/

https://networkx.org/documentation/stable/reference/index.html

https://scipy.org/

https://stackabuse.com/reading-and-writing-json-to-a-file-in-python/

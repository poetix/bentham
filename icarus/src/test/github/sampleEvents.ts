export const sampleJsonPayloadSignature = 'sha1=e9104ab9e5a9917614a6b5878f3cfe241c7fa714';
export const sampleJsonPayloadSecret = 'secret';
export const sampleJsonPayload = `{
  "ref": "refs/heads/master",
  "before": "db08862aa3e6c3825045c18d0c8b537664805ee0",
  "after": "c1f765245f4e4e00713fa208bd5688bba49f9471",
  "created": false,
  "deleted": false,
  "forced": false,
  "base_ref": null,
  "compare": "https://github.com/nicusX/dummy/compare/db08862aa3e6...c1f765245f4e",
  "commits": [
    {
      "id": "c1f765245f4e4e00713fa208bd5688bba49f9471",
      "tree_id": "9cb193fe7cedb9db53738f6dacf299ea45a0d461",
      "distinct": true,
      "message": "Add a file",
      "timestamp": "2017-09-26T14:54:38+01:00",
      "url": "https://github.com/nicusX/dummy/commit/c1f765245f4e4e00713fa208bd5688bba49f9471",
      "author": {
        "name": "Lorenzo Nicora",
        "email": "lorenzo.nicora@gmail.com",
        "username": "nicusX"
      },
      "committer": {
        "name": "Lorenzo Nicora",
        "email": "lorenzo.nicora@gmail.com",
        "username": "nicusX"
      },
      "added": [
        "something"
      ],
      "removed": [

      ],
      "modified": [

      ]
    }
  ],
  "head_commit": {
    "id": "c1f765245f4e4e00713fa208bd5688bba49f9471",
    "tree_id": "9cb193fe7cedb9db53738f6dacf299ea45a0d461",
    "distinct": true,
    "message": "Add a file",
    "timestamp": "2017-09-26T14:54:38+01:00",
    "url": "https://github.com/nicusX/dummy/commit/c1f765245f4e4e00713fa208bd5688bba49f9471",
    "author": {
      "name": "Lorenzo Nicora",
      "email": "lorenzo.nicora@gmail.com",
      "username": "nicusX"
    },
    "committer": {
      "name": "Lorenzo Nicora",
      "email": "lorenzo.nicora@gmail.com",
      "username": "nicusX"
    },
    "added": [
      "something"
    ],
    "removed": [

    ],
    "modified": [

    ]
  },
  "repository": {
    "id": 104728756,
    "name": "dummy",
    "full_name": "nicusX/dummy",
    "owner": {
      "name": "nicusX",
      "email": "lorenzo.nicora@gmail.com",
      "login": "nicusX",
      "id": 1433255,
      "avatar_url": "https://avatars1.githubusercontent.com/u/1433255?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/nicusX",
      "html_url": "https://github.com/nicusX",
      "followers_url": "https://api.github.com/users/nicusX/followers",
      "following_url": "https://api.github.com/users/nicusX/following{/other_user}",
      "gists_url": "https://api.github.com/users/nicusX/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/nicusX/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/nicusX/subscriptions",
      "organizations_url": "https://api.github.com/users/nicusX/orgs",
      "repos_url": "https://api.github.com/users/nicusX/repos",
      "events_url": "https://api.github.com/users/nicusX/events{/privacy}",
      "received_events_url": "https://api.github.com/users/nicusX/received_events",
      "type": "User",
      "site_admin": false
    },
    "private": false,
    "html_url": "https://github.com/nicusX/dummy",
    "description": "This is a dummy repo for testing Webhook integration",
    "fork": false,
    "url": "https://github.com/nicusX/dummy",
    "forks_url": "https://api.github.com/repos/nicusX/dummy/forks",
    "keys_url": "https://api.github.com/repos/nicusX/dummy/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/nicusX/dummy/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/nicusX/dummy/teams",
    "hooks_url": "https://api.github.com/repos/nicusX/dummy/hooks",
    "issue_events_url": "https://api.github.com/repos/nicusX/dummy/issues/events{/number}",
    "events_url": "https://api.github.com/repos/nicusX/dummy/events",
    "assignees_url": "https://api.github.com/repos/nicusX/dummy/assignees{/user}",
    "branches_url": "https://api.github.com/repos/nicusX/dummy/branches{/branch}",
    "tags_url": "https://api.github.com/repos/nicusX/dummy/tags",
    "blobs_url": "https://api.github.com/repos/nicusX/dummy/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/nicusX/dummy/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/nicusX/dummy/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/nicusX/dummy/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/nicusX/dummy/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/nicusX/dummy/languages",
    "stargazers_url": "https://api.github.com/repos/nicusX/dummy/stargazers",
    "contributors_url": "https://api.github.com/repos/nicusX/dummy/contributors",
    "subscribers_url": "https://api.github.com/repos/nicusX/dummy/subscribers",
    "subscription_url": "https://api.github.com/repos/nicusX/dummy/subscription",
    "commits_url": "https://api.github.com/repos/nicusX/dummy/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/nicusX/dummy/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/nicusX/dummy/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/nicusX/dummy/issues/comments{/number}",
    "contents_url": "https://api.github.com/repos/nicusX/dummy/contents/{+path}",
    "compare_url": "https://api.github.com/repos/nicusX/dummy/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/nicusX/dummy/merges",
    "archive_url": "https://api.github.com/repos/nicusX/dummy/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/nicusX/dummy/downloads",
    "issues_url": "https://api.github.com/repos/nicusX/dummy/issues{/number}",
    "pulls_url": "https://api.github.com/repos/nicusX/dummy/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/nicusX/dummy/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/nicusX/dummy/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/nicusX/dummy/labels{/name}",
    "releases_url": "https://api.github.com/repos/nicusX/dummy/releases{/id}",
    "deployments_url": "https://api.github.com/repos/nicusX/dummy/deployments",
    "created_at": 1506331102,
    "updated_at": "2017-09-25T09:18:22Z",
    "pushed_at": 1506434096,
    "git_url": "git://github.com/nicusX/dummy.git",
    "ssh_url": "git@github.com:nicusX/dummy.git",
    "clone_url": "https://github.com/nicusX/dummy.git",
    "svn_url": "https://github.com/nicusX/dummy",
    "homepage": null,
    "size": 0,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": null,
    "has_issues": true,
    "has_projects": true,
    "has_downloads": true,
    "has_wiki": true,
    "has_pages": false,
    "forks_count": 0,
    "mirror_url": null,
    "open_issues_count": 0,
    "forks": 0,
    "open_issues": 0,
    "watchers": 0,
    "default_branch": "master",
    "stargazers": 0,
    "master_branch": "master"
  },
  "pusher": {
    "name": "nicusX",
    "email": "lorenzo.nicora@gmail.com"
  },
  "sender": {
    "login": "nicusX",
    "id": 1433255,
    "avatar_url": "https://avatars1.githubusercontent.com/u/1433255?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/nicusX",
    "html_url": "https://github.com/nicusX",
    "followers_url": "https://api.github.com/users/nicusX/followers",
    "following_url": "https://api.github.com/users/nicusX/following{/other_user}",
    "gists_url": "https://api.github.com/users/nicusX/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/nicusX/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/nicusX/subscriptions",
    "organizations_url": "https://api.github.com/users/nicusX/orgs",
    "repos_url": "https://api.github.com/users/nicusX/repos",
    "events_url": "https://api.github.com/users/nicusX/events{/privacy}",
    "received_events_url": "https://api.github.com/users/nicusX/received_events",
    "type": "User",
    "site_admin": false
  }
}`;

export const pushWithOneCommit = {
  "ref": "refs/heads/master",
  "before": "db08862aa3e6c3825045c18d0c8b537664805ee0",
  "after": "c1f765245f4e4e00713fa208bd5688bba49f9471",
  "created": false,
  "deleted": false,
  "forced": false,
  "base_ref": null,
  "compare": "https://github.com/nicusX/dummy/compare/db08862aa3e6...c1f765245f4e",
  "commits": [
    {
      "id": "c1f765245f4e4e00713fa208bd5688bba49f9471",
      "tree_id": "9cb193fe7cedb9db53738f6dacf299ea45a0d461",
      "distinct": true,
      "message": "Add a file",
      "timestamp": "2017-09-26T14:54:38+01:00",
      "url": "https://github.com/nicusX/dummy/commit/c1f765245f4e4e00713fa208bd5688bba49f9471",
      "author": {
        "name": "Lorenzo Nicora",
        "email": "lorenzo.nicora@gmail.com",
        "username": "nicusX"
      },
      "committer": {
        "name": "Lorenzo Nicora",
        "email": "lorenzo.nicora@gmail.com",
        "username": "nicusX"
      },
      "added": [
        "something"
      ],
      "removed": [

      ],
      "modified": [

      ]
    }
  ],
  "head_commit": {
    "id": "c1f765245f4e4e00713fa208bd5688bba49f9471",
    "tree_id": "9cb193fe7cedb9db53738f6dacf299ea45a0d461",
    "distinct": true,
    "message": "Add a file",
    "timestamp": "2017-09-26T14:54:38+01:00",
    "url": "https://github.com/nicusX/dummy/commit/c1f765245f4e4e00713fa208bd5688bba49f9471",
    "author": {
      "name": "Lorenzo Nicora",
      "email": "lorenzo.nicora@gmail.com",
      "username": "nicusX"
    },
    "committer": {
      "name": "Lorenzo Nicora",
      "email": "lorenzo.nicora@gmail.com",
      "username": "nicusX"
    },
    "added": [
      "something"
    ],
    "removed": [

    ],
    "modified": [

    ]
  },
  "repository": {
    "id": 104728756,
    "name": "dummy",
    "full_name": "nicusX/dummy",
    "owner": {
      "name": "nicusX",
      "email": "lorenzo.nicora@gmail.com",
      "login": "nicusX",
      "id": 1433255,
      "avatar_url": "https://avatars1.githubusercontent.com/u/1433255?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/nicusX",
      "html_url": "https://github.com/nicusX",
      "followers_url": "https://api.github.com/users/nicusX/followers",
      "following_url": "https://api.github.com/users/nicusX/following{/other_user}",
      "gists_url": "https://api.github.com/users/nicusX/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/nicusX/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/nicusX/subscriptions",
      "organizations_url": "https://api.github.com/users/nicusX/orgs",
      "repos_url": "https://api.github.com/users/nicusX/repos",
      "events_url": "https://api.github.com/users/nicusX/events{/privacy}",
      "received_events_url": "https://api.github.com/users/nicusX/received_events",
      "type": "User",
      "site_admin": false
    },
    "private": false,
    "html_url": "https://github.com/nicusX/dummy",
    "description": "This is a dummy repo for testing Webhook integration",
    "fork": false,
    "url": "https://github.com/nicusX/dummy",
    "forks_url": "https://api.github.com/repos/nicusX/dummy/forks",
    "keys_url": "https://api.github.com/repos/nicusX/dummy/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/nicusX/dummy/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/nicusX/dummy/teams",
    "hooks_url": "https://api.github.com/repos/nicusX/dummy/hooks",
    "issue_events_url": "https://api.github.com/repos/nicusX/dummy/issues/events{/number}",
    "events_url": "https://api.github.com/repos/nicusX/dummy/events",
    "assignees_url": "https://api.github.com/repos/nicusX/dummy/assignees{/user}",
    "branches_url": "https://api.github.com/repos/nicusX/dummy/branches{/branch}",
    "tags_url": "https://api.github.com/repos/nicusX/dummy/tags",
    "blobs_url": "https://api.github.com/repos/nicusX/dummy/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/nicusX/dummy/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/nicusX/dummy/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/nicusX/dummy/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/nicusX/dummy/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/nicusX/dummy/languages",
    "stargazers_url": "https://api.github.com/repos/nicusX/dummy/stargazers",
    "contributors_url": "https://api.github.com/repos/nicusX/dummy/contributors",
    "subscribers_url": "https://api.github.com/repos/nicusX/dummy/subscribers",
    "subscription_url": "https://api.github.com/repos/nicusX/dummy/subscription",
    "commits_url": "https://api.github.com/repos/nicusX/dummy/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/nicusX/dummy/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/nicusX/dummy/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/nicusX/dummy/issues/comments{/number}",
    "contents_url": "https://api.github.com/repos/nicusX/dummy/contents/{+path}",
    "compare_url": "https://api.github.com/repos/nicusX/dummy/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/nicusX/dummy/merges",
    "archive_url": "https://api.github.com/repos/nicusX/dummy/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/nicusX/dummy/downloads",
    "issues_url": "https://api.github.com/repos/nicusX/dummy/issues{/number}",
    "pulls_url": "https://api.github.com/repos/nicusX/dummy/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/nicusX/dummy/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/nicusX/dummy/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/nicusX/dummy/labels{/name}",
    "releases_url": "https://api.github.com/repos/nicusX/dummy/releases{/id}",
    "deployments_url": "https://api.github.com/repos/nicusX/dummy/deployments",
    "created_at": 1506331102,
    "updated_at": "2017-09-25T09:18:22Z",
    "pushed_at": 1506434096,
    "git_url": "git://github.com/nicusX/dummy.git",
    "ssh_url": "git@github.com:nicusX/dummy.git",
    "clone_url": "https://github.com/nicusX/dummy.git",
    "svn_url": "https://github.com/nicusX/dummy",
    "homepage": null,
    "size": 0,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": null,
    "has_issues": true,
    "has_projects": true,
    "has_downloads": true,
    "has_wiki": true,
    "has_pages": false,
    "forks_count": 0,
    "mirror_url": null,
    "open_issues_count": 0,
    "forks": 0,
    "open_issues": 0,
    "watchers": 0,
    "default_branch": "master",
    "stargazers": 0,
    "master_branch": "master"
  },
  "pusher": {
    "name": "nicusX",
    "email": "lorenzo.nicora@gmail.com"
  },
  "sender": {
    "login": "nicusX",
    "id": 1433255,
    "avatar_url": "https://avatars1.githubusercontent.com/u/1433255?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/nicusX",
    "html_url": "https://github.com/nicusX",
    "followers_url": "https://api.github.com/users/nicusX/followers",
    "following_url": "https://api.github.com/users/nicusX/following{/other_user}",
    "gists_url": "https://api.github.com/users/nicusX/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/nicusX/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/nicusX/subscriptions",
    "organizations_url": "https://api.github.com/users/nicusX/orgs",
    "repos_url": "https://api.github.com/users/nicusX/repos",
    "events_url": "https://api.github.com/users/nicusX/events{/privacy}",
    "received_events_url": "https://api.github.com/users/nicusX/received_events",
    "type": "User",
    "site_admin": false
  }
};


export const pushWithTwoCommits = {
  "ref": "refs/heads/changes",
  "before": "9049f1265b7d61be4a8904a9a27120d2064dab3b",
  "after": "0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c",
  "created": false,
  "deleted": false,
  "forced": false,
  "base_ref": null,
  "compare": "https://github.com/baxterthehacker/public-repo/compare/9049f1265b7d...0d1a26e67d8f",
  "commits": [
    {
      "id": "0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c",
      "tree_id": "f9d2a07e9488b91af2641b26b9407fe22a451433",
      "distinct": true,
      "message": "Update README.md",
      "timestamp": "2015-05-05T19:40:15-04:00",
      "url": "https://github.com/baxterthehacker/public-repo/commit/0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c",
      "author": {
        "name": "baxterthehacker",
        "email": "baxterthehacker@users.noreply.github.com",
        "username": "baxterthehacker"
      },
      "committer": {
        "name": "baxterthehacker",
        "email": "baxterthehacker@users.noreply.github.com",
        "username": "baxterthehacker"
      },
      "added": [

      ],
      "removed": [

      ],
      "modified": [
        "README.md"
      ]
    },
    {
      "id": "0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd2c",
      "tree_id": "f9d2a07e9488b91af2641b26b9407fe22a451433",
      "distinct": true,
      "message": "Update foobar",
      "timestamp": "2015-05-05T18:40:15-04:00",
      "url": "https://github.com/baxterthehacker/public-repo/commit/0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd2c",
      "author": {
        "name": "baxterthehacker",
        "email": "baxterthehacker@users.noreply.github.com",
        "username": "baxterthehacker"
      },
      "committer": {
        "name": "baxterthehacker",
        "email": "baxterthehacker@users.noreply.github.com",
        "username": "baxterthehacker"
      },
      "added": [

      ],
      "removed": [

      ],
      "modified": [
        "foobar"
      ]
    }
  ],
  "head_commit": {
    "id": "0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c",
    "tree_id": "f9d2a07e9488b91af2641b26b9407fe22a451433",
    "distinct": true,
    "message": "Update README.md",
    "timestamp": "2015-05-05T19:40:15-04:00",
    "url": "https://github.com/baxterthehacker/public-repo/commit/0d1a26e67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c",
    "author": {
      "name": "baxterthehacker",
      "email": "baxterthehacker@users.noreply.github.com",
      "username": "baxterthehacker"
    },
    "committer": {
      "name": "baxterthehacker",
      "email": "baxterthehacker@users.noreply.github.com",
      "username": "baxterthehacker"
    },
    "added": [

    ],
    "removed": [

    ],
    "modified": [
      "README.md"
    ]
  },
  "repository": {
    "id": 35129377,
    "name": "public-repo",
    "full_name": "baxterthehacker/public-repo",
    "owner": {
      "name": "baxterthehacker",
      "email": "baxterthehacker@users.noreply.github.com"
    },
    "private": false,
    "html_url": "https://github.com/baxterthehacker/public-repo",
    "description": "",
    "fork": false,
    "url": "https://github.com/baxterthehacker/public-repo",
    "forks_url": "https://api.github.com/repos/baxterthehacker/public-repo/forks",
    "keys_url": "https://api.github.com/repos/baxterthehacker/public-repo/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/baxterthehacker/public-repo/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/baxterthehacker/public-repo/teams",
    "hooks_url": "https://api.github.com/repos/baxterthehacker/public-repo/hooks",
    "issue_events_url": "https://api.github.com/repos/baxterthehacker/public-repo/issues/events{/number}",
    "events_url": "https://api.github.com/repos/baxterthehacker/public-repo/events",
    "assignees_url": "https://api.github.com/repos/baxterthehacker/public-repo/assignees{/user}",
    "branches_url": "https://api.github.com/repos/baxterthehacker/public-repo/branches{/branch}",
    "tags_url": "https://api.github.com/repos/baxterthehacker/public-repo/tags",
    "blobs_url": "https://api.github.com/repos/baxterthehacker/public-repo/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/baxterthehacker/public-repo/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/baxterthehacker/public-repo/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/baxterthehacker/public-repo/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/baxterthehacker/public-repo/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/baxterthehacker/public-repo/languages",
    "stargazers_url": "https://api.github.com/repos/baxterthehacker/public-repo/stargazers",
    "contributors_url": "https://api.github.com/repos/baxterthehacker/public-repo/contributors",
    "subscribers_url": "https://api.github.com/repos/baxterthehacker/public-repo/subscribers",
    "subscription_url": "https://api.github.com/repos/baxterthehacker/public-repo/subscription",
    "commits_url": "https://api.github.com/repos/baxterthehacker/public-repo/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/baxterthehacker/public-repo/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/baxterthehacker/public-repo/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/baxterthehacker/public-repo/issues/comments{/number}",
    "contents_url": "https://api.github.com/repos/baxterthehacker/public-repo/contents/{+path}",
    "compare_url": "https://api.github.com/repos/baxterthehacker/public-repo/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/baxterthehacker/public-repo/merges",
    "archive_url": "https://api.github.com/repos/baxterthehacker/public-repo/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/baxterthehacker/public-repo/downloads",
    "issues_url": "https://api.github.com/repos/baxterthehacker/public-repo/issues{/number}",
    "pulls_url": "https://api.github.com/repos/baxterthehacker/public-repo/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/baxterthehacker/public-repo/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/baxterthehacker/public-repo/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/baxterthehacker/public-repo/labels{/name}",
    "releases_url": "https://api.github.com/repos/baxterthehacker/public-repo/releases{/id}",
    "created_at": 1430869212,
    "updated_at": "2015-05-05T23:40:12Z",
    "pushed_at": 1430869217,
    "git_url": "git://github.com/baxterthehacker/public-repo.git",
    "ssh_url": "git@github.com:baxterthehacker/public-repo.git",
    "clone_url": "https://github.com/baxterthehacker/public-repo.git",
    "svn_url": "https://github.com/baxterthehacker/public-repo",
    "homepage": null,
    "size": 0,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": null,
    "has_issues": true,
    "has_downloads": true,
    "has_wiki": true,
    "has_pages": true,
    "forks_count": 0,
    "mirror_url": null,
    "open_issues_count": 0,
    "forks": 0,
    "open_issues": 0,
    "watchers": 0,
    "default_branch": "master",
    "stargazers": 0,
    "master_branch": "master"
  },
  "pusher": {
    "name": "baxterthehacker",
    "email": "baxterthehacker@users.noreply.github.com"
  },
  "sender": {
    "login": "baxterthehacker",
    "id": 6752317,
    "avatar_url": "https://avatars.githubusercontent.com/u/6752317?v=3",
    "gravatar_id": "",
    "url": "https://api.github.com/users/baxterthehacker",
    "html_url": "https://github.com/baxterthehacker",
    "followers_url": "https://api.github.com/users/baxterthehacker/followers",
    "following_url": "https://api.github.com/users/baxterthehacker/following{/other_user}",
    "gists_url": "https://api.github.com/users/baxterthehacker/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/baxterthehacker/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/baxterthehacker/subscriptions",
    "organizations_url": "https://api.github.com/users/baxterthehacker/orgs",
    "repos_url": "https://api.github.com/users/baxterthehacker/repos",
    "events_url": "https://api.github.com/users/baxterthehacker/events{/privacy}",
    "received_events_url": "https://api.github.com/users/baxterthehacker/received_events",
    "type": "User",
    "site_admin": false
  }
};

export const ping = {
  "zen": "It's not fully shipped until it's fast.",
  "hook_id": 16463592,
  "hook": {
    "type": "Repository",
    "id": 16463592,
    "name": "web",
    "active": true,
    "events": [
      "push"
    ],
    "config": {
      "content_type": "json",
      "insecure_ssl": "0",
      "secret": "********",
      "url": "https://6q66dfzkre.execute-api.eu-west-2.amazonaws.com/dev/events"
    },
    "updated_at": "2017-09-28T16:40:45Z",
    "created_at": "2017-09-28T16:40:45Z",
    "url": "https://api.github.com/repos/nicusX/dummy/hooks/16463592",
    "test_url": "https://api.github.com/repos/nicusX/dummy/hooks/16463592/test",
    "ping_url": "https://api.github.com/repos/nicusX/dummy/hooks/16463592/pings",
    "last_response": {
      "code": null,
      "status": "unused",
      "message": null
    }
  },
  "repository": {
    "id": 104728756,
    "name": "dummy",
    "full_name": "nicusX/dummy",
    "owner": {
      "login": "nicusX",
      "id": 1433255,
      "avatar_url": "https://avatars1.githubusercontent.com/u/1433255?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/nicusX",
      "html_url": "https://github.com/nicusX",
      "followers_url": "https://api.github.com/users/nicusX/followers",
      "following_url": "https://api.github.com/users/nicusX/following{/other_user}",
      "gists_url": "https://api.github.com/users/nicusX/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/nicusX/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/nicusX/subscriptions",
      "organizations_url": "https://api.github.com/users/nicusX/orgs",
      "repos_url": "https://api.github.com/users/nicusX/repos",
      "events_url": "https://api.github.com/users/nicusX/events{/privacy}",
      "received_events_url": "https://api.github.com/users/nicusX/received_events",
      "type": "User",
      "site_admin": false
    },
    "private": false,
    "html_url": "https://github.com/nicusX/dummy",
    "description": "This is a dummy repo for testing Webhook integration",
    "fork": false,
    "url": "https://api.github.com/repos/nicusX/dummy",
    "forks_url": "https://api.github.com/repos/nicusX/dummy/forks",
    "keys_url": "https://api.github.com/repos/nicusX/dummy/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/nicusX/dummy/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/nicusX/dummy/teams",
    "hooks_url": "https://api.github.com/repos/nicusX/dummy/hooks",
    "issue_events_url": "https://api.github.com/repos/nicusX/dummy/issues/events{/number}",
    "events_url": "https://api.github.com/repos/nicusX/dummy/events",
    "assignees_url": "https://api.github.com/repos/nicusX/dummy/assignees{/user}",
    "branches_url": "https://api.github.com/repos/nicusX/dummy/branches{/branch}",
    "tags_url": "https://api.github.com/repos/nicusX/dummy/tags",
    "blobs_url": "https://api.github.com/repos/nicusX/dummy/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/nicusX/dummy/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/nicusX/dummy/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/nicusX/dummy/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/nicusX/dummy/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/nicusX/dummy/languages",
    "stargazers_url": "https://api.github.com/repos/nicusX/dummy/stargazers",
    "contributors_url": "https://api.github.com/repos/nicusX/dummy/contributors",
    "subscribers_url": "https://api.github.com/repos/nicusX/dummy/subscribers",
    "subscription_url": "https://api.github.com/repos/nicusX/dummy/subscription",
    "commits_url": "https://api.github.com/repos/nicusX/dummy/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/nicusX/dummy/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/nicusX/dummy/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/nicusX/dummy/issues/comments{/number}",
    "contents_url": "https://api.github.com/repos/nicusX/dummy/contents/{+path}",
    "compare_url": "https://api.github.com/repos/nicusX/dummy/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/nicusX/dummy/merges",
    "archive_url": "https://api.github.com/repos/nicusX/dummy/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/nicusX/dummy/downloads",
    "issues_url": "https://api.github.com/repos/nicusX/dummy/issues{/number}",
    "pulls_url": "https://api.github.com/repos/nicusX/dummy/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/nicusX/dummy/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/nicusX/dummy/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/nicusX/dummy/labels{/name}",
    "releases_url": "https://api.github.com/repos/nicusX/dummy/releases{/id}",
    "deployments_url": "https://api.github.com/repos/nicusX/dummy/deployments",
    "created_at": "2017-09-25T09:18:22Z",
    "updated_at": "2017-09-25T09:18:22Z",
    "pushed_at": "2017-09-26T14:15:55Z",
    "git_url": "git://github.com/nicusX/dummy.git",
    "ssh_url": "git@github.com:nicusX/dummy.git",
    "clone_url": "https://github.com/nicusX/dummy.git",
    "svn_url": "https://github.com/nicusX/dummy",
    "homepage": null,
    "size": 2,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": null,
    "has_issues": true,
    "has_projects": true,
    "has_downloads": true,
    "has_wiki": true,
    "has_pages": false,
    "forks_count": 0,
    "mirror_url": null,
    "open_issues_count": 0,
    "forks": 0,
    "open_issues": 0,
    "watchers": 0,
    "default_branch": "master"
  },
  "sender": {
    "login": "nicusX",
    "id": 1433255,
    "avatar_url": "https://avatars1.githubusercontent.com/u/1433255?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/nicusX",
    "html_url": "https://github.com/nicusX",
    "followers_url": "https://api.github.com/users/nicusX/followers",
    "following_url": "https://api.github.com/users/nicusX/following{/other_user}",
    "gists_url": "https://api.github.com/users/nicusX/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/nicusX/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/nicusX/subscriptions",
    "organizations_url": "https://api.github.com/users/nicusX/orgs",
    "repos_url": "https://api.github.com/users/nicusX/repos",
    "events_url": "https://api.github.com/users/nicusX/events{/privacy}",
    "received_events_url": "https://api.github.com/users/nicusX/received_events",
    "type": "User",
    "site_admin": false
  }
};

export const malformedEvent = {
  "a_random_property" : 'foobar',
}

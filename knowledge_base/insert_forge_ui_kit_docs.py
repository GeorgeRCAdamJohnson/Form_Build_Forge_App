import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'forge_knowledge_base.db')

# --- Resource: Forge UI Kit Documentation ---
RESOURCE = {
    'type': 'doc',
    'title': 'Forge UI Kit',
    'url': 'https://developer.atlassian.com/platform/forge/ui-kit/',
    'description': 'Official Atlassian documentation for Forge UI Kit (UI Kit 2+). Covers React runtime, supported hooks, API requests, limitations, and upgrade notes.'
}

BEST_PRACTICES = [
    {
        'title': 'React Runtime and Hooks',
        'details': 'UI Kit 2+ uses React runtime, supports most React hooks (except those requiring DOM access). Supported hooks: useState, useEffect, useContext, useReducer, useCallback, useMemo, useRef, useDebugValue, useDeferredValue, useId.'
    },
    {
        'title': 'JSX and Context Support',
        'details': 'JSX syntax and React context are supported in UI Kit 2+.'
    },
    {
        'title': 'API Requests in UI Kit',
        'details': 'Use @forge/bridge for Atlassian app fetch requests. Non-Atlassian fetches and storage API must go through a resolver.'
    },
    {
        'title': 'UI Kit Limitations',
        'details': 'No direct DOM access, no arbitrary HTML, only @forge/react components. Not supported in workflow condition/validator/post function modules.'
    },
    {
        'title': 'Upgrade Note',
        'details': 'Must use @forge/react v10+ for latest UI Kit. Upgrade with: npm install --save @forge/react@latest'
    }
]

SNIPPETS = [
    {
        'language': 'javascript',
        'code': 'import React, { useState, useEffect } from "react";',
        'context': 'Import React hooks for use in UI Kit 2+.'
    },
    {
        'language': 'javascript',
        'code': 'import { view } from "@forge/bridge";\nconst context = await view.getContext();',
        'context': 'Get Atlassian app context in UI Kit 2+.'
    }
]

LINKS = [
    ('UI Kit components', 'https://developer.atlassian.com/platform/forge/ui-kit/components/'),
    ('Hooks API Reference', 'https://reactjs.org/docs/hooks-reference.html'),
    ('Context - React', 'https://reactjs.org/docs/context.html'),
    ('requestJira', 'https://developer.atlassian.com/platform/forge/apis-reference/ui-api-bridge/requestJira/'),
    ('Forge resolver', 'https://developer.atlassian.com/platform/forge/runtime-reference/forge-resolver/')
]

def main():
    with sqlite3.connect(DB_PATH) as conn:
        c = conn.cursor()
        # Insert resource
        c.execute("""
            INSERT INTO resources (type, title, url, description)
            VALUES (?, ?, ?, ?)
        """, (RESOURCE['type'], RESOURCE['title'], RESOURCE['url'], RESOURCE['description']))
        resource_id = c.lastrowid

        # Insert best practices
        for bp in BEST_PRACTICES:
            c.execute("""
                INSERT INTO best_practices (title, details, resource_id)
                VALUES (?, ?, ?)
            """, (bp['title'], bp['details'], resource_id))

        # Insert code snippets
        for snip in SNIPPETS:
            c.execute("""
                INSERT INTO snippets (resource_id, language, code, context)
                VALUES (?, ?, ?, ?)
            """, (resource_id, snip['language'], snip['code'], snip['context']))

        # Insert links as resources (type: 'link')
        for title, url in LINKS:
            c.execute("""
                INSERT INTO resources (type, title, url, description)
                VALUES (?, ?, ?, ?)
            """, ('link', title, url, f'Resource link for {title} (from Forge UI Kit docs)'))

        conn.commit()
    print('[INFO] Forge UI Kit documentation, code snippets, and links inserted.')

if __name__ == '__main__':
    main()

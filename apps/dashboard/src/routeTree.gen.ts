/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AnalyticsImport } from './routes/analytics'
import { Route as AboutImport } from './routes/about'
import { Route as IndexImport } from './routes/index'
import { Route as AccidentsNewImport } from './routes/accidents.new'
import { Route as AccidentsIdEditImport } from './routes/accidents.$id.edit'

// Create/Update Routes

const AnalyticsRoute = AnalyticsImport.update({
  id: '/analytics',
  path: '/analytics',
  getParentRoute: () => rootRoute,
} as any)

const AboutRoute = AboutImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const AccidentsNewRoute = AccidentsNewImport.update({
  id: '/accidents/new',
  path: '/accidents/new',
  getParentRoute: () => rootRoute,
} as any)

const AccidentsIdEditRoute = AccidentsIdEditImport.update({
  id: '/accidents/$id/edit',
  path: '/accidents/$id/edit',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutImport
      parentRoute: typeof rootRoute
    }
    '/analytics': {
      id: '/analytics'
      path: '/analytics'
      fullPath: '/analytics'
      preLoaderRoute: typeof AnalyticsImport
      parentRoute: typeof rootRoute
    }
    '/accidents/new': {
      id: '/accidents/new'
      path: '/accidents/new'
      fullPath: '/accidents/new'
      preLoaderRoute: typeof AccidentsNewImport
      parentRoute: typeof rootRoute
    }
    '/accidents/$id/edit': {
      id: '/accidents/$id/edit'
      path: '/accidents/$id/edit'
      fullPath: '/accidents/$id/edit'
      preLoaderRoute: typeof AccidentsIdEditImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/analytics': typeof AnalyticsRoute
  '/accidents/new': typeof AccidentsNewRoute
  '/accidents/$id/edit': typeof AccidentsIdEditRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/analytics': typeof AnalyticsRoute
  '/accidents/new': typeof AccidentsNewRoute
  '/accidents/$id/edit': typeof AccidentsIdEditRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
  '/analytics': typeof AnalyticsRoute
  '/accidents/new': typeof AccidentsNewRoute
  '/accidents/$id/edit': typeof AccidentsIdEditRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/about'
    | '/analytics'
    | '/accidents/new'
    | '/accidents/$id/edit'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/about' | '/analytics' | '/accidents/new' | '/accidents/$id/edit'
  id:
    | '__root__'
    | '/'
    | '/about'
    | '/analytics'
    | '/accidents/new'
    | '/accidents/$id/edit'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AboutRoute: typeof AboutRoute
  AnalyticsRoute: typeof AnalyticsRoute
  AccidentsNewRoute: typeof AccidentsNewRoute
  AccidentsIdEditRoute: typeof AccidentsIdEditRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AboutRoute: AboutRoute,
  AnalyticsRoute: AnalyticsRoute,
  AccidentsNewRoute: AccidentsNewRoute,
  AccidentsIdEditRoute: AccidentsIdEditRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/about",
        "/analytics",
        "/accidents/new",
        "/accidents/$id/edit"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/about": {
      "filePath": "about.tsx"
    },
    "/analytics": {
      "filePath": "analytics.tsx"
    },
    "/accidents/new": {
      "filePath": "accidents.new.tsx"
    },
    "/accidents/$id/edit": {
      "filePath": "accidents.$id.edit.tsx"
    }
  }
}
ROUTE_MANIFEST_END */

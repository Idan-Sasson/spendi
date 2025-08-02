@echo off
setlocal enabledelayedexpansion

:: ── Adjust this relative path to where your JSON lives under src
set "jsonFile=%~dp0src\certs.json"

if not exist "%jsonFile%" (
  echo ERROR: Cannot find %jsonFile%
  exit /b 1
)

:: 1) Read the line containing build_version
for /f "tokens=2 delims=:" %%A in ('type "%jsonFile%"') do (
    set "rawVersion=%%A"
)

:: 2) Strip spaces, commas, braces and quotes
set "rawVersion=%rawVersion: =%"
set "rawVersion=%rawVersion:,=%"
set "rawVersion=%rawVersion:}=%"
set "rawVersion=%rawVersion:"=%"

:: 3) Split into major and minor by the dot
for /f "tokens=1,2 delims=." %%M in ("%rawVersion%") do (
    set "major=%%M"
    set "minor=%%N"
)

:: 4) Increment the minor part
set /a minor+=1

:: 5) Reassemble the new version string
set "newVersion=%major%.%minor%"

:: 6) Overwrite the JSON file with the updated version
> "%jsonFile%" echo {"build_version": %newVersion%}

echo Updated build_version to %newVersion%

npm run build && npm run deploy
#!/usr/bin/env python3
"""Simple automated smoke test for the static club registration site.

This script starts a tiny local HTTP server in the workspace, fetches the
homepage, and checks that the expected markup is present.
"""

from __future__ import annotations

import contextlib
import re
import sys
import threading
import time
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

WORKSPACE = Path(__file__).resolve().parent
PORT = 8765
URL = f"http://127.0.0.1:{PORT}/index.html"


class QuietHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(WORKSPACE), **kwargs)

    def log_message(self, format: str, *args) -> None:
        return


def run_server() -> ThreadingHTTPServer:
    server = ThreadingHTTPServer(("127.0.0.1", PORT), QuietHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def main() -> int:
    server = run_server()

    try:
        time.sleep(0.2)
        with urllib.request.urlopen(URL, timeout=5) as response:
            html = response.read().decode("utf-8")
            status = response.status

        require(status == 200, f"Expected HTTP 200 but got {status}.")
        require("<title>Software Engineering Club Registration</title>" in html,
                "Missing the expected page title.")
        require('name="google-sheets-web-app-url"' in html,
                "Missing the Google Sheets meta tag.")
        require('id="registrationForm"' in html,
                "Missing the registration form element.")
        require('id="registerBtn"' in html,
                "Missing the registration submit button.")
        require('class="hero"' in html,
                "Missing the hero section.")

        # Optional sanity check on the form field wiring.
        required_fields = [
            'id="firstName"',
            'id="lastName"',
            'id="studentId"',
            'id="email"',
            'id="phone"',
            'id="dob"',
        ]
        for field in required_fields:
            require(field in html, f"Missing expected form field: {field}")

        print("Smoke test passed: homepage responded with 200 and required site structure is present.")
        return 0
    except Exception as exc:
        print(f"Smoke test failed: {exc}", file=sys.stderr)
        return 1
    finally:
        with contextlib.suppress(Exception):
            server.shutdown()
            server.server_close()


if __name__ == "__main__":
    raise SystemExit(main())

import argparse
import os
import platform
import subprocess

## Small CLI command to start up the app passing TMDB API key via CLI
def main():
  # Parse CLI arguments
  parser = argparse.ArgumentParser(description='CLI tool to set tmdb api key and run docker-compose up.')
  parser.add_argument('--tmdb-key', help='Value to set for the tmdb api key', required=True)
  args = parser.parse_args()

  # Determine the OS
  current_os = platform.system()
  env_value = args.tmdb_key

  # Define the environment variable to set
  env_var_name = 'TMDB_API_KEY'
  os.environ[env_var_name] = env_value

  print(f"Setting {env_var_name}={env_value} for OS: {current_os}")

  # Run docker-compose up
  try:
    subprocess.run(['docker-compose', 'up'], check=True, env=os.environ)
  except subprocess.CalledProcessError as e:
    print(f"Error running docker-compose: {e}")
    exit(1)

if __name__ == '__main__':
  main()

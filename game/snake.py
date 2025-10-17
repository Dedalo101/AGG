import pygame
import random
import sys

def main():
    # Initialize Pygame
    pygame.init()

    # Constants
    WIDTH, HEIGHT = 600, 400
    GRID_SIZE = 20
    GRID_WIDTH = WIDTH // GRID_SIZE
    GRID_HEIGHT = HEIGHT // GRID_SIZE

    # Colors
    BLACK = (0, 0, 0)
    WHITE = (255, 255, 255)

    # Set up display
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    pygame.display.set_caption("Snake Game")

    # Snake and food
    snake = [(GRID_WIDTH // 2, GRID_HEIGHT // 2)]
    snake_dir = (1, 0)
    food = (random.randint(0, GRID_WIDTH-1), random.randint(0, GRID_HEIGHT-1))

    # Game variables
    clock = pygame.time.Clock()
    score = 0

    def draw():
        screen.fill(BLACK)
        # Draw snake
        for segment in snake:
            pygame.draw.rect(screen, WHITE, (segment[0] * GRID_SIZE, segment[1] * GRID_SIZE, GRID_SIZE, GRID_SIZE))
        # Draw food
        pygame.draw.rect(screen, WHITE, (food[0] * GRID_SIZE, food[1] * GRID_SIZE, GRID_SIZE, GRID_SIZE))
        pygame.display.flip()

    # Game loop
    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_UP and snake_dir != (0, 1):
                    snake_dir = (0, -1)
                elif event.key == pygame.K_DOWN and snake_dir != (0, -1):
                    snake_dir = (0, 1)
                elif event.key == pygame.K_LEFT and snake_dir != (1, 0):
                    snake_dir = (-1, 0)
                elif event.key == pygame.K_RIGHT and snake_dir != (-1, 0):
                    snake_dir = (1, 0)

        # Move snake
        head = (snake[0][0] + snake_dir[0], snake[0][1] + snake_dir[1])

        # Check collision with walls
        if head[0] < 0 or head[0] >= GRID_WIDTH or head[1] < 0 or head[1] >= GRID_HEIGHT:
            pygame.quit()
            sys.exit()

        # Check collision with self
        if head in snake:
            pygame.quit()
            sys.exit()

        snake.insert(0, head)

        # Check if food is eaten
        if head == food:
            score += 1
            food = (random.randint(0, GRID_WIDTH-1), random.randint(0, GRID_HEIGHT-1))
        else:
            snake.pop()

        draw()
        clock.tick(10)  # Control speed

if __name__ == "__main__":
    main()

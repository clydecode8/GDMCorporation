
#include <Windows.h>
#include <gl/GL.h>

#pragma comment (lib, "OpenGL32.lib")

#define WINDOW_TITLE "OpenGL Window"

GLfloat rotationAngle = 0.0f;

int qNo = 1; //Question No 1
LRESULT WINAPI WindowProcedure(HWND hWnd, UINT msg, WPARAM wParam, LPARAM lParam)
{
	switch (msg)
	{
	case WM_DESTROY:
		PostQuitMessage(0);
		break;

	case WM_KEYDOWN:
		if (wParam == VK_ESCAPE)
			PostQuitMessage(0);
		else if (wParam == 0x31)
			rotationAngle += 10.0f;
		else if (wParam == 0x32)
			rotationAngle -= 10.0f;

		break;

	default:
		break;
	}

	return DefWindowProc(hWnd, msg, wParam, lParam);
}
//--------------------------------------------------------------------

bool initPixelFormat(HDC hdc)
{
	PIXELFORMATDESCRIPTOR pfd;
	ZeroMemory(&pfd, sizeof(PIXELFORMATDESCRIPTOR));

	pfd.cAlphaBits = 8;
	pfd.cColorBits = 32;
	pfd.cDepthBits = 24;
	pfd.cStencilBits = 0;

	pfd.dwFlags = PFD_DOUBLEBUFFER | PFD_SUPPORT_OPENGL | PFD_DRAW_TO_WINDOW;

	pfd.iLayerType = PFD_MAIN_PLANE;
	pfd.iPixelType = PFD_TYPE_RGBA;
	pfd.nSize = sizeof(PIXELFORMATDESCRIPTOR);
	pfd.nVersion = 1;

	// choose pixel format returns the number most similar pixel format available
	int n = ChoosePixelFormat(hdc, &pfd);

	// set pixel format returns whether it sucessfully set the pixel format
	if (SetPixelFormat(hdc, n, &pfd))
	{
		glClearColor(0.2f, 0.2f, 0.2f, 1.0f);  // Dark gray clear color
		glEnable(GL_DEPTH_TEST);
		glDisable(GL_LIGHTING);
		glMatrixMode(GL_PROJECTION);
		glLoadIdentity();
		float aspectRatio = 1.0f;
		glFrustum(-aspectRatio, aspectRatio, -1.0, 1.0, 0.1, 100.0);

		glMatrixMode(GL_MODELVIEW);
		glLoadIdentity();
		glTranslatef(0.0f, 0.0f, -3.0f); // Adjust the translation along the -z axis

		glScalef(0.5f, 0.5f, 0.5f); // Scale the cube to half of its original size

		return true;
	}
	else
	{
		return false;
	}
}
//--------------------------------------------------------------------

void drawCube() {
	

	glRotatef(rotationAngle, 1.0f, 1.0f, 0.0f); // Rotate around the y-axis
	glRotatef(rotationAngle, 0.0f, 1.0f, 1.0f); // Rotate around the z-axis
	glBegin(GL_QUADS);

	// Face 1 (front)
	glColor3f(1.0f, 0.0f, 0.0f);  // Red
	glVertex3f(0.0f, 0.0f, 1.0f);
	glVertex3f(1.0f, 0.0f, 1.0f);
	glVertex3f(1.0f, 1.0f, 1.0f);
	glVertex3f(0.0f, 1.0f, 1.0f);

	// Face 2 (back)
	glColor3f(0.0f, 1.0f, 0.0f);  // Green
	glVertex3f(0.0f, 0.0f, 0.0f);
	glVertex3f(1.0f, 0.0f, 0.0f);
	glVertex3f(1.0f, 1.0f, 0.0f);
	glVertex3f(0.0f, 1.0f, 0.0f);

	// Face 3 (top)
	glColor3f(0.0f, 0.5f, 1.0f);
	glVertex3f(0.0f, 1.0f, 1.0f);
	glVertex3f(1.0f, 1.0f, 1.0f);
	glVertex3f(1.0f, 1.0f, 0.0f);
	glVertex3f(0.0f, 1.0f, 0.0f);

	// Face 4 (bottom)
	glColor3f(1.0f, 1.0f, 0.0f);
	glVertex3f(0.0f, 0.0f, 1.0f);
	glVertex3f(1.0f, 0.0f, 1.0f);
	glVertex3f(1.0f, 0.0f, 0.0f);
	glVertex3f(0.0f, 0.0f, 0.0f);

	// Face 5 (left)
	glColor3f(1.0f, 0.5f, 0.0f);
	glVertex3f(0.0f, 0.0f, 1.0f);
	glVertex3f(0.0f, 1.0f, 1.0f);
	glVertex3f(0.0f, 1.0f, 0.0f);
	glVertex3f(0.0f, 0.0f, 0.0f);

	// Face 6 (right)
	glColor3f(0.5f, 2.0f, 1.0f);
	glVertex3f(1.0f, 0.0f, 1.0f);
	glVertex3f(1.0f, 1.0f, 1.0f);
	glVertex3f(1.0f, 1.0f, 0.0f);
	glVertex3f(1.0f, 0.0f, 0.0f);

	glEnd();
}

void display()
{

	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);



	glLoadIdentity();
	glRotatef(1, 1,1,1); //test
	glScalef(0.5f, 0.5f, 0.5f); // Scale the cube to half of its original size
	drawCube();


}
//--------------------------------------------------------------------

int WINAPI WinMain(HINSTANCE hInst, HINSTANCE, LPSTR, int nCmdShow)
{
	WNDCLASSEX wc;
	ZeroMemory(&wc, sizeof(WNDCLASSEX));

	wc.cbSize = sizeof(WNDCLASSEX);
	wc.hInstance = GetModuleHandle(NULL);
	wc.lpfnWndProc = WindowProcedure;
	wc.lpszClassName = WINDOW_TITLE;
	wc.style = CS_HREDRAW | CS_VREDRAW;

	if (!RegisterClassEx(&wc)) return false;

	HWND hWnd = CreateWindow(WINDOW_TITLE, WINDOW_TITLE, WS_OVERLAPPEDWINDOW,
		50, 50, 1000, 1000,
		NULL, NULL, wc.hInstance, NULL);


	//--------------------------------
	//	Initialize window for OpenGL
	//--------------------------------

	HDC hdc = GetDC(hWnd);

	//	initialize pixel format for the window
	initPixelFormat(hdc);

	//	get an openGL context
	HGLRC hglrc = wglCreateContext(hdc);

	//	make context current
	if (!wglMakeCurrent(hdc, hglrc)) return false;

	//--------------------------------
	//	End initialization
	//--------------------------------

	ShowWindow(hWnd, nCmdShow);

	MSG msg;
	ZeroMemory(&msg, sizeof(msg));

	while (true)
	{
		if (PeekMessage(&msg, NULL, 0, 0, PM_REMOVE))
		{
			if (msg.message == WM_QUIT) break;

			TranslateMessage(&msg);
			DispatchMessage(&msg);
		}

		display();
		SwapBuffers(hdc);
	}

	UnregisterClass(WINDOW_TITLE, wc.hInstance);

	return true;
}
//--------------------------------------------------------------------
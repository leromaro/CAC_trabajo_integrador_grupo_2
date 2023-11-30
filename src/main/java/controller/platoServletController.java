package controller;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;


@WebServlet("/menu")
public class platoServletController extends HttpServlet{
    	public static final String HTML_START="<html><body>";
	public static final String HTML_END="</body></html>";

    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        
        
        //String nombre=req.getParameter("nombre");
        //req.setAttribute("nombre", nombre.toUpperCase());
        //RequestDispatcher despachador= req.getRequestDispatcher("/menumayúsculas");
        //despachador.forward(req, res);  
        PrintWriter out = res.getWriter();
        Date date = new Date();
        out.println(HTML_START + "<h2>Hola</h2><br/><h3>Date="+date +"</h3>"+HTML_END);
        out.flush();
        out.close();
    }
    
        @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res)throws ServletException, IOException {
        // Lógica
        PrintWriter out = res.getWriter();
        out.println(HTML_START + "<h2>POST Request Processed!</h2>" + HTML_END);
        out.flush();
        out.close();
    }
    
        @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse res)throws ServletException, IOException {
        // Lógica
        PrintWriter out = res.getWriter();
        out.println(HTML_START + "<h2>DELETE Request Processed!</h2>" + HTML_END);
        out.flush();
        out.close();
        
    }  
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Company;
use App\Models\Employee;
use App\Models\TimeBlock;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Company 1: Hair Salon Pro
        $company1 = Company::updateOrCreate(
            ['username' => 'salon1'],
            [
                'name' => 'Hair Salon Pro',
                'username' => 'salon1',
                'password' => Hash::make('password1'),
            ]
        );
        
        // Ensure ID is set if it was just created
        if (empty($company1->id)) {
            $company1->id = (string) Str::uuid();
            $company1->save();
        }

        $employee1_1 = Employee::create([
            'id' => (string) Str::uuid(),
            'company_id' => $company1->id,
            'name' => 'Maria',
            'color' => '#3b82f6',
            'display_order' => 0,
        ]);

        $employee1_2 = Employee::create([
            'id' => (string) Str::uuid(),
            'company_id' => $company1->id,
            'name' => 'John',
            'color' => '#10b981',
            'display_order' => 1,
        ]);

        // Add some example time blocks for company 1
        TimeBlock::create([
            'id' => (string) Str::uuid(),
            'company_id' => $company1->id,
            'employee_id' => $employee1_1->id,
            'date' => date('Y-m-d'),
            'start_time' => '09:00',
            'end_time' => '10:00',
            'client_name' => 'Jane Doe',
            'task' => 'Haircut',
        ]);

        TimeBlock::create([
            'id' => (string) Str::uuid(),
            'company_id' => $company1->id,
            'employee_id' => $employee1_2->id,
            'date' => date('Y-m-d'),
            'start_time' => '14:00',
            'end_time' => '15:30',
            'client_name' => 'Bob Smith',
            'task' => 'Haircut and styling',
        ]);

        // Company 2: Beauty Studio
        $company2 = Company::updateOrCreate(
            ['username' => 'salon2'],
            [
                'name' => 'Beauty Studio',
                'username' => 'salon2',
                'password' => Hash::make('password2'),
            ]
        );
        
        // Ensure ID is set if it was just created
        if (empty($company2->id)) {
            $company2->id = (string) Str::uuid();
            $company2->save();
        }

        $employee2_1 = Employee::create([
            'id' => (string) Str::uuid(),
            'company_id' => $company2->id,
            'name' => 'Sarah',
            'color' => '#f59e0b',
            'display_order' => 0,
        ]);

        $employee2_2 = Employee::create([
            'id' => (string) Str::uuid(),
            'company_id' => $company2->id,
            'name' => 'Mike',
            'color' => '#ef4444',
            'display_order' => 1,
        ]);

        // Add some example time blocks for company 2
        TimeBlock::create([
            'id' => (string) Str::uuid(),
            'company_id' => $company2->id,
            'employee_id' => $employee2_1->id,
            'date' => date('Y-m-d'),
            'start_time' => '10:00',
            'end_time' => '11:00',
            'client_name' => 'Alice Johnson',
            'task' => 'Hair coloring',
        ]);

        TimeBlock::create([
            'id' => (string) Str::uuid(),
            'company_id' => $company2->id,
            'employee_id' => $employee2_2->id,
            'date' => date('Y-m-d'),
            'start_time' => '16:00',
            'end_time' => '17:00',
            'client_name' => 'Tom Wilson',
            'task' => 'Beard trim',
        ]);

        $this->command->info('✅ Created 2 companies with employees and time blocks:');
        $this->command->info('');
        $this->command->info('Company 1 - Hair Salon Pro:');
        $this->command->info('  Username: salon1');
        $this->command->info('  Password: password1');
        $this->command->info('  Employees: Maria, John');
        $this->command->info('');
        $this->command->info('Company 2 - Beauty Studio:');
        $this->command->info('  Username: salon2');
        $this->command->info('  Password: password2');
        $this->command->info('  Employees: Sarah, Mike');
    }
}
